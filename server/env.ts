import { z } from "zod";
import dotenv from "dotenv"
dotenv.config()

const envSchema = z.object({
  PORT: z.string(),
  AUTH0_AUDIENCE: z.string(),
  AUTH0_ISSUER_BASE_URL: z.string(),
  AUTH0_SIGNING_ALG: z.string().optional(),
});

export default envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
