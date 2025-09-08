import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { authMiddleware } from "../../middlewares/auth";
import { eq, getTableColumns } from "drizzle-orm";
import { BadRequestError } from "../../helpers/api-error";
import z from "zod";

export const getGift: FastifyPluginCallbackZod = (app) => {
  app.get("/gifts/:organization_id", {
    schema: {
      params: z.object({
        organization_id: z.uuid()
      })
    },
    preHandler: [authMiddleware]
  }, async (request, response) => {
    const { organization_id } = request.params;

    const orgExists = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, organization_id)
    });

    if (!orgExists) {
      throw new BadRequestError("Organization does not exist");
    }

    const gifts = await db.select()
      .from(schema.gifts)
      .where(eq(schema.gifts.organization_id, organization_id))

    return response.status(200).send(gifts);
  });
}
