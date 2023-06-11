import { fetchClient } from "@/services/fetchClient";
import { FC, useEffect, useState } from "react";
import { z } from "zod";

type TicketElement = {
  id: string
}

const Tickets: FC = () => {
  const [tickets, setData] = useState<TicketElement[]>([]);

  useEffect(() => {
    fetchClient({
      endpoint: "/api/tickets",
      schema: z.object({ tickets: z.array(z.object({id: z.string()})) }),
    }).then((res) => {
      if (!res.ok) console.error(res.error);
      else setData(res.data.tickets);
    });
  }, []);
  return (
    <div className="p-5 my-5">
      <div>{tickets.length ? tickets.map((ticket => <>{ticket.id}</>)) : "No tickets"}</div>
    </div>
  );
};

export default Tickets;
