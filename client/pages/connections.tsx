import { fetchClient } from "@/services/fetchClient";
import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { type SeatType } from "../../server/types";
// import Connection from "../types/Connection";
import SearchForm from "@/components/SearchForm";

const connectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  departureTime: z.date(),
  arrivalTime: z.date(),
  departureStation: z.string(),
  arrivalStation: z.string(),
  price: z.number(),
});
const Connections: FC = () => {
  const [data, setData] = useState<{} | null>(null);

  useEffect(() => {
    fetchClient({
      endpoint: "/api/connections",
      schema: z.array(connectionSchema),
    }).then((res) => {
      if (!res.ok) console.error(res.error);
      else setData(res.data);
    });
  }, []);
  return (
    <div className="p-5 my-5">
      <SearchForm />

      <h1>Example Page</h1>
      <div>{data ? data.hello : "You connections"}</div>
    </div>
  );
};

export default Connections;
