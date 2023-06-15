import { RequestHandler } from "express";
import { prisma } from "./prisma";
import { z } from "zod";
import { PassengerSimplyfied } from "../types";
import { getUser } from "../getUser";
import { passengerSchema, postSchema } from "../types";
import {calculateTicketPrice} from "./ticket";

const deleteTicket: RequestHandler = async (req, res) => {
    const authUser = await getUser(req.auth);
    const data = postSchema.parse(req.body);
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
            id: data.connectionId,
        },
    });
    if (!connection) {
        return res.status(500).json({ error: "Connection not found" });
    }
    const compartmentPassengers = ticket.passengers.filter((passenger) => passenger.seat === "COMPARTMENT").length;
    const openPassengers = ticket.passengers.filter((passenger) => passenger.seat === "OPEN").length;
  };

const updateTicket: RequestHandler = async (req, res) => {
    const authUser = await getUser(req.auth);
    const data = postSchema.parse(req.body);
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
            id: data.connectionId,
        },
    });
    if (!connection) {
        return res.status(500).json({ error: "Connection not found" });
    }

};


  export default {
    deleteTicket,
    updateTicket
  };