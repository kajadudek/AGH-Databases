import express, { RequestHandler } from "express";
import { prisma } from "./prisma";
import { getUser } from "../getUser";
import { TicketToDisplay, Ticket, Connection, PassengerSimplyfied2} from "../types";

const app = express();

const getConnection = async (id: string): Promise<Connection> => {
  const connection = await prisma.connection.findUnique({
    where: {
      id: id,
    },
  });
  if (!connection) {
    throw new Error("Connection not found");
  }
  return connection;
};

const get: RequestHandler = async (req, res) => {
  const authUser = await getUser(req.auth);
  const tickets = await prisma.ticket.findMany({
    where: {
      user: {
        email: authUser?.email,
      },
    },
  });

  const data = tickets.map(async (ticket: Ticket) => {
    const train = getConnection(ticket.connectionID);
    if (!train) {
      throw new Error("Connection not found");
    }
    const newTicket: TicketToDisplay = {
      id: ticket.id,
      connectionName: (await train).name,
      departureStation: (await train).departureStation.name,
      arrivalStation: (await train).arrivalStation.name,
      departure: (await train).departure.toString(),
      arrival: (await train).arrival.toString(),
      price: ticket.price,
      passengers: ticket.passengers.map((passenger): PassengerSimplyfied2 => {
        return {
          name: passenger.name,
          discount: passenger.discount.toString(),
          seat: passenger.seat.toString(),
          status: passenger.status.toString(),
        };
      }),
    };
    return newTicket;
  });
  const ticketsArray = await Promise.all(data);
  return res.json({ticketsArray});
};

export default {
  get,
};
