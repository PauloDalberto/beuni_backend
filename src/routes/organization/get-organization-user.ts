import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import z from "zod";
import { authMiddleware } from "../../middlewares/auth";
import { and, eq } from "drizzle-orm";
import { authorize } from "../../middlewares/authorize";

export const getOrganization: FastifyPluginCallbackZod = (app) => {
  app.get("/organizations/:userId", {
    schema: {
      params: z.object({
        userId: z.uuid(),
      })
    },
    preHandler: [authMiddleware, authorize(['admin', 'manager', 'user'])]
  },
  async (request, response) => {
    const { userId } = request.params;

    return db.select().from(schema.organizations)
  })
}