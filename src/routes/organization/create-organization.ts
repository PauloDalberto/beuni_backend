import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { BadRequestError } from "../../helpers/api-error";
import { eq } from 'drizzle-orm';

export const createOrganization: FastifyPluginCallbackZod = (app) => {
  app.post("/organizations", {
    schema: {
      body: z.object({
        name: z.string().min(1),
        userId: z.uuid()
      })
    }
  },
  async (request, response) => {
    const { name, userId } = request.body;

    const orgExists = await db.query.organizations.findFirst({
      where: eq(schema.organizations.name, name)
    });

    if (orgExists) {
      throw new BadRequestError("Organization name already exists");
    }

    const [org] = await db.insert(schema.organizations).values({
      name,
    }).returning();

    if (!org) {
      throw new BadRequestError("An error occurred while creating organization");
    }

    await db.insert(schema.usersOrganizations).values({
      userId,
      organizationId: org.id,
      role: "admin", 
    });

    return response.status(201).send(org);
  })
}