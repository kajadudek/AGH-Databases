import { fetchServer } from "@/services/fetchServer";
import { NextApiHandler } from "next";

const tickets: NextApiHandler = async (req, res) => {
  const ticketsData = await fetchServer({
    req,
    res,
    endpoint: "tickets",
  });
  if (!ticketsData.ok) {
    console.log("Error fetching tickets:");
    return res.status(500).json({ error: ticketsData.error });
  }
  console.log(ticketsData.data);
  return res.json(ticketsData.data);
};

export default tickets;
