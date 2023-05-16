import { fetchServer } from "@/services/fetchServer";
import { NextApiHandler } from "next";

const connection: NextApiHandler = async (req, res) => {
  console.log("dupa");
  const exampleData = await fetchServer({
    req,
    res,
    endpoint: "connectionsByDate",
  });

  if (!exampleData.ok) {
    console.log("dupa2");
    return res.status(500).json({ error: exampleData.error });
  }
  return res.json(exampleData.data);
};

export default connection;
