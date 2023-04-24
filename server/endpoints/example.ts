import { RequestHandler } from "express";

const get: RequestHandler = (req, res) => {
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
