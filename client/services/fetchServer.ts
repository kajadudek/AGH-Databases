import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRouter } from "next/router";
import { NextRequest, NextResponse } from "next/server";
import { ZodAny, ZodRawShape, ZodSchema, z } from "zod";

type FetchServer = {
  endpoint: string;
  req: NextApiRequest;
  res: NextApiResponse;
  body?: any;
};

export const fetchServer = async ({
  endpoint,
  req,
  res,
  body,
}: FetchServer): Promise<
  | {
      ok: false;
      error: string;
    }
  | {
      ok: true;
      data: unknown;
    }
  | {
      ok: false;
      error: "Unauthorized";
    }
> => {
  let accessToken: string | undefined;
  try {
    const data = await getAccessToken(req, res);
    accessToken = data?.accessToken;
  } catch (err) {
    return { ok: false, error: "Unauthorized" };
  }
  const { BACKEND_URL } = process.env;
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not defined");
  }
  const headers = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: body ? 'POST' : 'GET', // Jeżeli przekazujemy dane to ustawiamy metodę na 'POST'
      headers: {
        ...headers,
        'Content-Type': 'application/json', // Jeżeli przekazujemy dane to potrzebujemy nagłówka
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  if (response.status === 401) {
    return { ok: false, error: "Unauthorized" };
  }
  if (!response.ok) {
    return { ok: false, error: response.statusText };
  }

  const data = await response.json();
  return { data, ok: true };
};