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

  const totalPrice = await calculateTicketPrice(data.passengers, req.body.price);

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
      price: totalPrice,
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

type Passenger = {
  name: string,
  discount: Discount,
  seat: string,
  status: string
}

const calculateTicketPrice = async (passengers: Passenger[], ticketPrice: number) => {
  let totalPrice = 0;

  for (let passenger of passengers) {
    const discountValue = await prisma.discountValue.findFirst({
      where: { 
        discount: passenger.discount 
      }
    });

    if (discountValue) {
      totalPrice += ticketPrice - (ticketPrice * discountValue.value);
    } else {
      totalPrice += ticketPrice;
    }
  }
  
  return totalPrice;
}
