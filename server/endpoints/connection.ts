import express, { RequestHandler } from "express";
import { prisma } from "./prisma";
import { SeatType } from "@prisma/client";
import { Path } from "../types";

const app = express();

const get: RequestHandler = async (req, res) => {
  const connection = await prisma.connection.findUnique({
    where: {
      id: req.body.connectionId,
    },
  });
  if (!connection) {
    return res.status(500).json({ error: "Connection not found" });
  } else {
    console.log(connection);
    return res.json(connection);
  }
};

const post: RequestHandler = async (req, res) => {
  const newConnection = await prisma.connection.create({
    data: {
      name: req.body.name,
      capacity: [
        {
          available: req.body.compartmentAvailable,
          booked: req.body.compartmentBooked,
          type: req.body.compartmentType as SeatType,
        },
        {
          available: req.body.openAvailable,
          booked: req.body.openBooked,
          type: req.body.openType as SeatType,
        },
      ],
      departure: req.body.departureDate,
      departureStation: {
        name: req.body.departureStationName,
        city: req.body.departureStationCity,
        country: req.body.departureStationCountry,
      },
      arrivalStation: {
        name: req.body.arrivalStationName,
        city: req.body.arrivalStationCity,
        country: req.body.arrivalStationCountry,
      },
      arrival: req.body.arrivalDate,
      price: req.body.price,
    },
  });
  return res.json(newConnection);
};

const findPaths: RequestHandler = async (req, res) => {
  const { start, end } = req.body;
  try {
    const paths = await findAllPaths(start, end);
    return res.json(paths);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export default {
  get,
  post,
  findPaths
};

type Connection = {
  _id: string;
  departureStation: string;
  arrivalStation: string;
  departure: Date;
  arrival: Date;
  price: number;
};

const getConnections = async (): Promise<Connection[]> => {
  const connection = await prisma.connection.findMany();
  const data = connection.map((record) => ({
    _id: record.id,
    departureStation: record.departureStation.city,
    arrivalStation: record.arrivalStation.city,
    departure: new Date(record.departure),
    arrival: new Date(record.arrival),
    price: record.price,
  }));
  return data;
};

export const findAllPaths = async (
  start: string,
  end: string,
  arrivalTime: number = 0,
  departureTime: number = 0, // New parameter
  visited: { [key: string]: boolean } = {},
  path: string[] = [],
  travelTime: number = 0,
  totalPrice: number = 0,
  connectionIds: string[] = [],
  departureDate: Date = new Date(), // New parameter
  arrivalDate: Date = new Date() // New parameter
): Promise<Path[]> => {
  const connections = await getConnections();

  // Budujemy graf
  const graph: { [key: string]: { [key: string]: Connection } } = {};
  for (let connection of connections) {
    if (!graph[connection.departureStation]) {
      graph[connection.departureStation] = {};
    }
    graph[connection.departureStation][connection.arrivalStation] = connection;
  }

  visited[start] = true;
  path.push(start);

  let paths: Path[] = [];

  // Jeśli dotarliśmy do celu, dodajemy aktualną ścieżkę do listy ścieżek
  if (start === end) {
    paths.push({
      stations: [...path],
      travelTime: travelTime,
      arrivalTime,
      departureTime,
      totalPrice,
      connectionIds: [...connectionIds],
      departureDate: departureDate,
      arrivalDate: arrivalDate
    });
  } else {
    // Jeśli nie, to dla nieodwiedzonych miast dodajemy je do ścieżki
    // i wywołujemy rekurencyjnie funkcję
    for (let node in graph[start]) {
      const connection = graph[start][node];
      // Sprawdzamy, czy jesteśmy w stanie przesiąść się do danego pociągu
      if (!visited[node] && connection.departure.getTime() > arrivalTime) {
        paths = paths.concat(
          await findAllPaths(
            node,
            end,
            connection.arrival.getTime(),
            departureTime === 0 ? connection.departure.getTime() : departureTime,
            visited,
            path,
            travelTime + connection.arrival.getTime() - connection.departure.getTime(),
            totalPrice + connection.price,
            [...connectionIds, connection._id],
            departureTime === 0 ? connection.departure : departureDate, // New parameter
            connection.arrival // New parameter
          )
        );
      }
    }
  }

  path.pop();
  visited[start] = false;

  // Zwracamy posortowaną listę połączeń po czasie trwania (nie wliczamy postojów)
  return paths.sort((a, b) => a.travelTime - b.travelTime);
};

