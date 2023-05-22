import express, { RequestHandler } from "express";
import { prisma } from "./prisma";
import { z } from "zod";
import { Discount } from "@prisma/client";

const app = express();

const passengerSchema = z.object({
  name: z.string(),
  discount: z.enum(["NONE", "CHILD", "STUDENT", "SENIOR"]),
  seat: z.enum(["OPEN", "COMPARTMENT"]),
  status: z.enum(["ACTIVE", "RETURNED"]),
});

const postSchema = z.object({
  email: z.string().email(),
  connectionId: z.string(),
  passengers: z.array(passengerSchema),
});

const post: RequestHandler = async (req, res) => {
  const data = postSchema.parse(req.body);
  const connection = await prisma.connection.findUnique({
    where: {
      id: data.connectionId,
    },
  });
  if (!connection) {
    return res.status(500).json({ error: "Connection not found" });
  }

  const ticket = await prisma.ticket.create({
    data: {
      passengers: data.passengers,
      user: {
        connect: {
          email: data.email,
        },
      },
      connection: {
        connect: {
          id: data.connectionId,
        },
      },
      price: req.body.price,
    },
  });
  return res.json(ticket);
};
const get: RequestHandler = async (req, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: req.body.ticketId,
    },
  });
  return res.json(ticket);
};

export default {
  get,
  post,
};
