
import express, { RequestHandler } from "express";
import { prisma } from "./prisma";

const app = express()

const get: RequestHandler = async (req, res) => {
    const tickets = await prisma.ticket.findMany();
  return res.json({
    hello:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
};

const post: RequestHandler = (req, res) => {
  return res.json({post: true})
}

export default {
  get, post
};