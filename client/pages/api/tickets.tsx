import { fetchServer } from "@/services/fetchServer";
import { NextApiHandler } from "next";

const tickets: NextApiHandler = async (req, res) => {
  const ticketsData = await fetchServer({
    req,
    res,
    endpoint: "tickets",
  });

  if (!ticketsData.ok) {
    return res.status(500).json({ error: ticketsData.error });
  }
  return res.json(ticketsData.data);
};

export default tickets;
