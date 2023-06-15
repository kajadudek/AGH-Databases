import { RequestHandler } from "express";
import { prisma } from "./prisma";
import { passengerSchema, postSchema, putSchema } from "../types";
import {calculateTicketPrice} from "./ticket";

const deleteTicket: RequestHandler = async (req, res) => {
    console.log("deleteTicket");
    const ticket = await prisma.ticket.findUnique({
        where: {
            id: req.body.ticketId,
        },
    });
    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }
    const connection = await prisma.connection.findUnique({
        where: {
            id: ticket.connectionID,
        },
    });
    if (!connection) {
        return res.status(500).json({ error: "Connection not found" });
    }
    const compartmentPassengers = ticket.passengers.filter((passenger) => passenger.seat === "COMPARTMENT").length;
    const openPassengers = ticket.passengers.filter((passenger) => passenger.seat === "OPEN").length;

    const compartmentCapacity = connection.capacity.find((capacity) => capacity.type === "COMPARTMENT");
    const openCapacity = connection.capacity.find((capacity) => capacity.type === "OPEN");

    if (!compartmentCapacity) {
        return res.status(400).json({ error: "Cannot find compartment capacity" });
    }

    if (!openCapacity) {
        return res.status(400).json({ error: "Cannot find open capacity" });
    }

    compartmentCapacity.available += compartmentPassengers;
    compartmentCapacity.booked -= compartmentPassengers;

    openCapacity.available += openPassengers;
    openCapacity.booked -= openPassengers;

    const updateConnection = prisma.connection.update({
        where: {
          id: connection.id,
        },
        data: {
          capacity: connection.capacity,
        },
      });

    const deletedTicket = prisma.ticket.delete({
        where: {
            id: ticket.id,
        },
    });
    try {
        const [updatedConnection, ticket] = await prisma.$transaction([updateConnection, deletedTicket]);
        return res.json(ticket);
      } catch (error) {
        return res.status(500).json({ error: "Failed to delete ticket because of server error" });
      }
    
    };


const updateTicket: RequestHandler = async (req, res) => {
    const data = putSchema.parse(req.body);
    const ticket = await prisma.ticket.findUnique({
        where: {
            id: req.body.ticketId,
        },
    });
    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }
    const connection = await prisma.connection.findUnique({
        where: {
            id: ticket.connectionID,
        },
    });
    if (!connection) {
        return res.status(500).json({ error: "Connection not found" });
    }
    const compartmentPassengersOld = ticket.passengers.filter((passenger) => passenger.seat === "COMPARTMENT").length;
    const openPassengersOld = ticket.passengers.filter((passenger) => passenger.seat === "OPEN").length;

    const compartmentPassengersNew = data.passengers.filter((passenger) => passenger.seat === "COMPARTMENT").length;
    const openPassengersNew = data.passengers.filter((passenger) => passenger.seat === "OPEN").length;

    const compartmentCapacity = connection.capacity.find((capacity) => capacity.type === "COMPARTMENT");
    const openCapacity = connection.capacity.find((capacity) => capacity.type === "OPEN");

    if (!compartmentCapacity) {
        return res.status(400).json({ error: "Cannot find compartment capacity" });
    }

    if (!openCapacity) {
        return res.status(400).json({ error: "Cannot find open capacity" });
    }

    compartmentCapacity.available -= compartmentPassengersNew - compartmentPassengersOld;
    compartmentCapacity.booked += compartmentPassengersNew - compartmentPassengersOld;

    openCapacity.available -= openPassengersNew - openPassengersOld;
    openCapacity.booked += openPassengersNew - openPassengersOld;

    const updateConnection = prisma.connection.update({
        where: {
          id: connection.id,
        },
        data: {
          capacity: connection.capacity,
        },
      });

      const updatedTicket = prisma.ticket.update({
        where: {
            id: ticket.id,
        },
        data: {
            passengers: data.passengers,
            price: await calculateTicketPrice(data.passengers, connection.price),
        },

      });

    try {
        const [updatedConnection, ticket] = await prisma.$transaction([updateConnection, updatedTicket]);
        return res.json(ticket);
      } catch (error) {
        return res.status(500).json({ error: "Failed to update ticket because of server error" });
      }

};


  export default {
    deleteTicket,
    updateTicket
  };