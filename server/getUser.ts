import { RequestHandler } from "express";
import { z } from "zod";

type Auth = Parameters<RequestHandler>[0]["auth"];

const userSchema = z
  .object({
    sub: z.string().optional(),
    nickname: z.string().optional(),
    name: z.string().optional(),
    picture: z.string().optional(),
    email: z.string().optional(),
    email_verified: z.boolean().optional(),
  })
  .optional();

export const getUser = async (auth: Auth) => {
  if (!auth) return null;
  const url = auth.payload.iss + "userinfo";
  const headers = {
    Authorization: `Bearer ${auth.token}`,
  };
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    return userSchema.parse(data);
  } catch (error) {
    console.error(error);
    return null;
  }
};
