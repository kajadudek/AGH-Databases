import express, { RequestHandler } from "express";
import { prisma } from "./prisma";

const app = express();

const get: RequestHandler = async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json({
    hello: "user",
  });
};

const post: RequestHandler = async (req, res) => {
  const newUser = await prisma.user.create({
    data: {
      email: req.body.email,
    },
  });
  return res.json(newUser);
};

export default {
  get,
  post,
};
