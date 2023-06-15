import { RequestHandler } from "express";
import { prisma } from "./prisma";
import { z } from "zod";
import { PassengerSimplyfied } from "../types";
import { getUser } from "../getUser";
import { passengerSchema, postSchema } from "../types";

const post: RequestHandler = async (req, res) => {
  const authUser = await getUser(req.auth);
  const data = postSchema.parse(req.body);
  const connection = await prisma.connection.findUnique({
    where: {
      id: data.connectionId,
    },
  });
  if (!connection) {
    return res.status(500).json({ error: "Connection not found" });
  }

  // Calculate how many seats ticket will take
  const compartmentPassengers = data.passengers.filter((passenger) => passenger.seat === "COMPARTMENT").length;
  const openPassengers = data.passengers.filter((passenger) => passenger.seat === "OPEN").length;

  const compartmentCapacity = connection.capacity.find((capacity) => capacity.type === "COMPARTMENT");
  const openCapacity = connection.capacity.find((capacity) => capacity.type === "OPEN");

  if (!compartmentCapacity || compartmentCapacity.available < compartmentPassengers) {
    return res.status(400).json({ error: "Not enough compartment seats available" });
  }

  if (!openCapacity || openCapacity.available < openPassengers) {
    return res.status(400).json({ error: "Not enough open seats available" });
  }

  compartmentCapacity.available -= compartmentPassengers;
  compartmentCapacity.booked += compartmentPassengers;

  openCapacity.available -= openPassengers;
  openCapacity.booked += openPassengers;

  // Calculate total price of ticket
  const totalPrice = await calculateTicketPrice(data.passengers, req.body.price);

  // Change the capacity of train
  const updateConnection = prisma.connection.update({
    where: {
      id: data.connectionId,
    },
    data: {
      capacity: connection.capacity,
    },
  });

  // Create tickets
  const createTicket = prisma.ticket.create({
    data: {
      passengers: data.passengers,
      user: {
        connect: {
          email: authUser?.email,
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

  try {
    const [updatedConnection, ticket] = await prisma.$transaction([updateConnection, createTicket]);
    return res.json(ticket);
  } catch (error) {
    return res.status(500).json({ error: "Failed to book ticket because of server error" });
  }

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



export const calculateTicketPrice = async (passengers: PassengerSimplyfied[], ticketPrice: number) => {
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
