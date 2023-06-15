import { fetchServer } from "@/services/fetchServer";
import { NextApiHandler } from "next";

const ticketDeleted: NextApiHandler = async (req, res) => {
    console.log("ticketDeleted function called");
    console.log("req.body:", req.body.ticketId);
  const ticketsData = await fetchServer({
    req,
    res,
    endpoint: "updateTicket",
    body: req.body, // Przekazujemy dane
  });
  console.log("ticketsData:", ticketsData);
  console.log("req.body:", req.body.ticketId);
  if (!ticketsData.ok) {
    console.log("Error fetching tickets:");
    return res.status(500).json({ error: ticketsData.error });
  }
  console.log(ticketsData.data);
  return res.json(ticketsData.data);
};

export default ticketDeleted;
