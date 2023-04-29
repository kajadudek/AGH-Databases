import express, { RequestHandler } from "express";
import { prisma } from "./prisma";
import { SeatType } from "@prisma/client";

const app = express();

const get: RequestHandler = async (req, res) => {
  const connections = await prisma.connection.findMany();
  return res.json({
    hello: "connection",
  });
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
