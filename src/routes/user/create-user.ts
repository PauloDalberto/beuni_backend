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

    let user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });

    if (!user) {
      const hashPassword = await bcrypt.hash(password, 10)
      const [newUser] = await db.insert(schema.users).values({
        email,
        name,
        password: hashPassword
      }).returning();
      user = newUser;
    }

    const userOrgExists = await db.query.usersOrganizations.findFirst({
      where: and(
        eq(schema.usersOrganizations.userId, user.id),
        eq(schema.usersOrganizations.organizationId, organization_id)
      )
    });

    if(userOrgExists) {
      throw new BadRequestError("User already belongs to this organization");
    }

    const orgUsersCount = await db
      .select({ count: sql<string>`count(*)` })
      .from(schema.usersOrganizations)
      .where(eq(schema.usersOrganizations.organizationId, organization_id));

    const role = Number(orgUsersCount[0].count) === 0 ? "admin" : "user";

    await db.insert(schema.usersOrganizations).values({
      userId: user.id,
      organizationId: organization_id,
      role
    });

    const { password: _, ...userSafe } = user;

    return response.status(201).send({ user: userSafe })
  })
}