import { NextApiHandler } from "next";

const Handler: NextApiHandler = (req, res) => {
  return res.json({ hello: "world" });
};

export default Handler;
