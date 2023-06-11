import express, { RequestHandler } from "express";
import { prisma } from "./prisma";

const app = express();

const get: RequestHandler = async (req, res) => {
  const tickets = await prisma.ticket.findMany({
    where: {
      user: {
        email: req.body.email,
      },
    },
  });
  return res.json(tickets);
};

export default {
  get,
};
