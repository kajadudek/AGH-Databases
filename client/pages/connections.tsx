import { fetchClient } from "@/services/fetchClient";
import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { type SeatType } from "../../server/types";
import SearchForm from "@/components/SearchForm";

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
    <div className="p-5 my-5">
      <SearchForm />

      <h1>Example Page</h1>
      <div>{data ? data.hello : "You connections"}</div>
    </div>
  );
};

export default Example;
