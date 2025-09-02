import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { BadRequestError } from "../../helpers/api-error";
import { and, eq, sql } from "drizzle-orm";
import bcrypt from 'bcrypt';

export const createUser: FastifyPluginCallbackZod = (app) => {
  app.post("/register", {
    schema: {
      body: z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
      })
    }
  },
  async (request, response) => {
    const { email, name, password } = request.body;

    const existing = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (existing) {
      throw new BadRequestError("Email already exits");
    } 

    const hashPassword = await bcrypt.hash(password, 10);

    const [user] = await db.insert(schema.users).values({
      email,
      name,
      password: hashPassword,
    }).returning();

    const { password: _, ...safeUser } = user;
    
    return response.status(201).send({ user: safeUser });
  })
}