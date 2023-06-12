import express, { RequestHandler } from "express";
import { prisma } from "./prisma";
import { getUser } from "../getUser";

const app = express();

const get: RequestHandler = async (req, res) => {
  const authUser = await getUser(req.auth);
  const tickets = await prisma.ticket.findMany({
    where: {
      user: {
        email: authUser?.email,
      },
    },
  });
  return res.json({tickets});
};

export default {
  get,
};
