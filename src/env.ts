import { config } from 'dotenv';
config();

import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  NODE_ENV: z.string()
})

export const env = envSchema.parse(process.env);