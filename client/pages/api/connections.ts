import { fetchServer } from "@/services/fetchServer";
import { NextApiHandler } from "next";

const connection: NextApiHandler = async (req, res) => {
  const exampleData = await fetchServer({
    req,
    res,
    endpoint: "connectionsByDate",
  });

  if (!exampleData.ok) {
    return res.status(500).json({ error: exampleData.error });
  }
  return res.json(exampleData.data);
};

export default connection;
