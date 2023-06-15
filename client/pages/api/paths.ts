import { fetchServer } from "@/services/fetchServer";
import { NextApiHandler } from "next";

const pathsFinder: NextApiHandler = async (req, res) => {
    console.log("pathsFinder function called");
    const exampleData = await fetchServer({
        req,
        res,
        endpoint: "findPaths",
        body: req.body, // Przekazujemy dane
      });
  
    console.log('exampleData:', exampleData);
  
    if (!exampleData.ok) {
      console.log("paths2");
      return res.status(500).json({ error: exampleData.error });
    }
    return res.json(exampleData.data);
  };
  

export default pathsFinder;