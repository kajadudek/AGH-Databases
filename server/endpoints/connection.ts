
import express, { RequestHandler } from "express";
import { prisma } from "./prisma";

const app = express()

const get: RequestHandler = async (req, res) => {
    const connections = await prisma.connection.findMany();
  return res.json({
    hello:
      "connections",
  });
};

const post: RequestHandler = (req, res) => {
  return res.json({post: true})
}

export default {
  get, post
};
