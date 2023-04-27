
import express, { RequestHandler } from "express";
import { prisma } from "./prisma";

const app = express()

const get: RequestHandler = async (req, res) => {
    const users = await prisma.user.findMany();
  return res.json({
    hello:
      "user",
  });
};

const post: RequestHandler = (req, res) => {
  return res.json({post: true})
}

export default {
  get, post
};
