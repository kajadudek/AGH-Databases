import { fetchServer } from "@/services/fetchServer";
import { NextApiHandler } from "next";

const pathsFinder: NextApiHandler = async (req, res) => {
    console.log("buyingTicket function called");
    console.log('Request body:', req.body);

    const exampleData = await fetchServer({
        req,
        res,
        endpoint: "ticket",
        body: req.body, // Przekazujemy dane
      });
  
    if (!exampleData.ok) {
      console.log("ticket2");
      return res.status(500).json({ error: exampleData.error });
    }
    return res.json(exampleData.data);
  };
  

export default pathsFinder;