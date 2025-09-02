import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { authMiddleware } from "../../middlewares/auth";
import z from "zod";
import { BadRequestError } from "../../helpers/api-error";
import { eq } from "drizzle-orm";

export const getDepartment: FastifyPluginCallbackZod = (app) => {
  app.get("/departments/:organization_id", {
    schema: {
      params: z.object({
        organization_id: z.uuid()
      })
    },
    preHandler: [authMiddleware]
  }, async (request, response) => {
    const { organization_id } = request.params

    const orgExists = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, organization_id)
    });

    if (!orgExists) {
      throw new BadRequestError("Organization does not exist");
    }

    const getDepartment = await db.select()
    .from(schema.departments)
    .where(eq(schema.departments.organization_id, organization_id),)

    return response.status(200).send(getDepartment)
  })
}