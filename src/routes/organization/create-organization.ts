import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { BadRequestError } from "../../helpers/api-error";
import { eq } from 'drizzle-orm';
import { authMiddleware } from "../../middlewares/auth";

export const createOrganization: FastifyPluginCallbackZod = (app) => {
  app.post("/organizations", {
    schema: {
      body: z.object({
        name: z.string().min(1),
      })
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { name } = request.body;

    const orgExists = await db.query.organizations.findFirst({
      where: eq(schema.organizations.name, name)
    });

    if (orgExists) {
      throw new BadRequestError("Organization name already exists");
    }

    const result = await db.insert(schema.organizations).values({
      name
    }).returning()

    if(result.length === 0) {
      throw new BadRequestError("An error occurred while sending the data")
    }

    return response.status(201).send(result)
  })
}