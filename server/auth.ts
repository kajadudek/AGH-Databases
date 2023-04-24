import { auth } from "express-oauth2-jwt-bearer";
import env from "./env";

export const jwtCheck = auth({
  audience: env.AUTH0_AUDIENCE,
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: env.AUTH0_SIGNING_ALG,
});
