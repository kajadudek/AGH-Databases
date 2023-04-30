import { fetchClient } from "@/services/fetchClient";
import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { type SeatType } from "../../server/types";

const Example: FC = () => {
  const [data, setData] = useState<{ hello: string } | null>(null);
  useEffect(() => {
    fetchClient({
      endpoint: "/api/connections",
      schema: z.object({ hello: z.string() }),
    }).then((res) => {
      if (!res.ok) console.error(res.error);
      else setData(res.data);
    });
  }, []);
  return (
    <div>
      <h1>Example Page</h1>
      <div>{data ? data.hello : "You connections"}</div>
    </div>
  );
};

export default Example;
