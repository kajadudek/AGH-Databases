import { fetchClient } from "@/services/fetchClient";
import { FC, use, useEffect, useState } from "react";
import { z } from "zod";

const Example: FC = () => {
  const [data, setData] = useState<{ hello: string } | null>(null)
  useEffect(() => {
    fetchClient({
      endpoint: "/api/example",
      schema: z.object({ hello: z.string() }),
    }).then((res) => {
      if (res.ok) {
        return res.data;
      }
      return null;
    }).then((res => setData(res)))
  }, []
  );

  return (
    <div>
      <h1>Example Page</h1>
      <div>{data ? data.hello : "You are not authenticated"}</div>
    </div>
  );
};

export default Example;
