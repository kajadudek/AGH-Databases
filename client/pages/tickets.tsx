import { fetchClient } from "@/services/fetchClient";
import { FC, useEffect, useState } from "react";
import { z } from "zod";

const Tickets: FC = () => {
  const [data, setData] = useState<{ hello: string } | null>(null);

  useEffect(() => {
    fetchClient({
      endpoint: "/api/tickets",
      schema: z.object({ hello: z.string() }),
    }).then((res) => {
      if (!res.ok) console.error(res.error);
      else setData(res.data);
    });
  }, []);
  return (
    <div className="p-5 my-5">
      <div>{data ? data.hello : "You tickets"}</div>
    </div>
  );
};

export default Tickets;
