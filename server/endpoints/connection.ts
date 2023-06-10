import express, { RequestHandler } from "express";
import { prisma } from "./prisma";
import { SeatType } from "@prisma/client";

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

export default {
  get,
  post,
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

// Finds the shortest path (by the time of travel, excluding stops)
const dijkstra = async (source: string, target: string) => {
  const connections = await getConnections();

  // budujemy graf
  const graph: { [key: string]: { [key: string]: number } } = {};
  for (let connection of connections) {
    if (!graph[connection.departureStation]) {
      graph[connection.departureStation] = {};
    }
    // zakładamy, że czas podróży to nasza waga
    const travelTime = connection.arrival.getTime() - connection.departure.getTime();
    graph[connection.departureStation][connection.arrivalStation] = travelTime;
  }

  // algorytm Dijkstry
  const Q = new Set(Object.keys(graph));
  const dist: { [key: string]: number } = {};
  const prev: { [key: string]: string | null } = {};
  for (let node of Q) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[source] = 0;

  while (Q.size) {
    let minDist = Infinity;
    let u = "";
    for (let node of Q) {
      if (dist[node] < minDist) {
        minDist = dist[node];
        u = node;
      }
    }

    Q.delete(u);

    for (let neighbor in graph[u]) {
      const alt = dist[u] + graph[u][neighbor];
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = u;
      }
    }
  }

  // odtwarzamy najkrótszą ścieżkę
  let u = target;
  const path = [];
  let travelTime = 0;

  while (prev[u]) {
    path.unshift(u);
    travelTime += graph[prev[u]][u];
    u = prev[u]!;
  }
  path.unshift(u);

  const travelTimeInHours = travelTime / (1000 * 60 * 60);

  return { path, travelTime: travelTimeInHours };
};

// Przykładowe wywołanie
// dijkstra("Katowice", "Warszawa").then(path => console.log(path));
// dijkstra("Warszawa", "Katowice").then(path => console.log(path));


// Finds all paths (has regard to arrival and departure time of trains)
type Path = {
  stations: string[];
  travelTime: number; // hours
  arrivalTime: number; // time in milliseconds
};

const findAllPaths = async (
  start: string,
  end: string,
  arrivalTime: number = 0,
  visited: { [key: string]: boolean } = {},
  path: string[] = [],
  travelTime: number = 0): Promise<Path[]> => {
  const connections = await getConnections();

  // budujemy graf
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
    });
  } else {
    // Jeśli nie, to dla nieodwiedzonych miast dodajemy je do ścieżki 
    // i wywołujemy rekurencyjnie funkcję
    for (let node in graph[start]) {
      const connection = graph[start][node];
      // Sprawdzamy, czy jesteśmy w stanie przesiąść się do danego pociągu
      if (!visited[node] && connection.departure.getTime() > arrivalTime) {
        paths = paths.concat(
          await findAllPaths(node, end, connection.arrival.getTime(), visited, path, travelTime + connection.arrival.getTime() - connection.departure.getTime())
        );
      }
    }
  }

  path.pop();
  visited[start] = false;

  // Zwracamy posortowaną listę połączeń po czasie trwania (nie wliczamy postojów)
  return paths.sort((a, b) => a.travelTime - b.travelTime);
};

// Przykładowe wywołanie (prawidłowo nie znajduje ścieżki Katowice -> Tychy -> Poznań, bo nie ma czasu na przesiadkę)
findAllPaths("Katowice", "Poznań").then(paths => {  
  paths.forEach(path => {
    console.log(`Path: ${path.stations.join(" -> ")}, Travel Time: ${path.travelTime/3600000} hours`);
  });
});

findAllPaths("Tychy", "Warszawa").then(paths => {  
  paths.forEach(path => {
    console.log(`Path: ${path.stations.join(" -> ")}, Travel Time: ${path.travelTime/3600000} hours`);
  });
});

findAllPaths("Poznań", "Tychy").then(paths => {  
  paths.forEach(path => {
    console.log(`Path: ${path.stations.join(" -> ")}, Travel Time: ${path.travelTime/3600000} hours`);
  });
});
