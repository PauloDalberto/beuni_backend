import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";

export const getOrganization: FastifyPluginCallbackZod = (app) => {
  app.get("/organizations", async () => {
    return db.select().from(schema.organizations)
  })
}