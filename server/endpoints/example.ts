import { RequestHandler } from "express";

const get: RequestHandler = (req, res) => {
  return res.json({
    hello:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
};

export default {
  get,
};
