import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { BadRequestError } from "../../helpers/api-error";
import { and, eq } from "drizzle-orm";
import bcrypt from 'bcrypt';

export const createUser: FastifyPluginCallbackZod = (app) => {
  app.post("/register", {
    schema: {
      body: z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
        organization_id: z.uuid()
      })
    }
  },
  async (request, response) => {
    const { email, name, password, organization_id } = request.body;

    const orgExists = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, organization_id)
    });

    if(!orgExists) {
      throw new BadRequestError("Organization name not exists");
    }

    const emailExistsOnOrg = await db.query.users.findFirst({
      where: and(
        eq(schema.users.email, email),
        eq(schema.users.organization_id, organization_id)
      )
    });

    if (emailExistsOnOrg) {
      throw new BadRequestError('Email already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const [newUser] = await db.insert(schema.users).values({
      email,
      name,
      password: hashPassword,
      organization_id
    }).returning()

    const { password: _, ...createUser } = newUser;

    return response.status(201).send(createUser)
  })
}