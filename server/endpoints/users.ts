import express, { RequestHandler } from "express";
import { prisma } from "./prisma";

const app = express();

const get: RequestHandler = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
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
