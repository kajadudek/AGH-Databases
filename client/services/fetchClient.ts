import { NextRouter } from "next/router";
import { ZodRawShape, ZodSchema } from "zod";

type FetchClient<T> = {
  endpoint: string;
  schema: ZodSchema<T>;
};

export const fetchClient = async <T>({
  endpoint,
  schema,
}: FetchClient<T>): Promise<
  { error: string; ok: false } | { ok: true; data: T }
> => {
  const res = (await fetch(endpoint)) as Response;
  if (!res.ok) {
    return { error: res.statusText, ok: false };
  }
  const data = (await res.json()) as unknown;
  const parsedData = schema.safeParse(data);
  if (parsedData.success) {
    return { data: parsedData.data, ok: true };
  }
  return { error: parsedData.error.message, ok: false };
};
