import "fastify";
import { InferSelectModel } from "drizzle-orm";
import { users } from "../db/schema/users";

type User = InferSelectModel<typeof users>;

declare module "fastify" {
  interface FastifyRequest {
    user: Partial<User>;
    cookies: {
      token?: string; 
    };
  }
}
