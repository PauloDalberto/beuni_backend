import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { authMiddleware } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";

export const getOrganization: FastifyPluginCallbackZod = (app) => {
  app.get("/organizations", {
    preHandler: [authMiddleware, authorize(['admin', 'manager', 'user'])]
  }, async () => {
    return db.select().from(schema.organizations)
  })
}