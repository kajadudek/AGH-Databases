import { RequestHandler } from "express";
import { prisma } from "./prisma";


const get: RequestHandler = async (req, res) => {
  let connections;
  console.log("cos");
  if (req.body.dateType === "departure") {
    connections = await prisma.connection.findMany({
      where: {
        departure: { gte: req.body.departureMin, lte: req.body.departureMax },
        departureStation: req.body.departureStation,
        price: { gte: req.body.priceMin, lte: req.body.priceMax },
      },
    });
  } else {
    connections = await prisma.connection.findMany({
      where: {
        arrival: { gte: req.body.arrivalMin, lte: req.body.arrivalMax },
        arrivalStation: req.body.arrivalStation,
        price: { gte: req.body.priceMin, lte: req.body.priceMax },
      },
    });
  }
  if (!connections) {
    return res.status(500).json({ error: "Connection not found" });
  } else {
    return res.json(connections);
  }
};
export default {
  get,
};
