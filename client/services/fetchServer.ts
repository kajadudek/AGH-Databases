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
  console.log("fetchServer function called");
  try {
    const data = await getAccessToken(req, res);
    accessToken = data?.accessToken;
  } catch (err) {
    return { ok: false, error: "Unauthorized" };
  }
  console.log("accessToken: ", accessToken);
  const { BACKEND_URL } = process.env;
  console.log("BACKEND_URL: ", BACKEND_URL);
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not defined");
  }
  console.log("id: ", req.body.ticketId);
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
    console.log("response: ", response.body);
    console.log("respone.ok: ", response.ok);
  if (response.status === 401) {
    return { ok: false, error: "Unauthorized" };
  }
  if (!response.ok) {
    return { ok: false, error: response.statusText };
  }

  const data = await response.json();
  return { data, ok: true };
};
