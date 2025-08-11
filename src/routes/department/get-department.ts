import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";

export const getDepartment: FastifyPluginCallbackZod = (app) => {
  app.get("/departments", async () => {
    return db.select().from(schema.departments)
  })
}