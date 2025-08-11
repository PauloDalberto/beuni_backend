import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";

export const getEmployee: FastifyPluginCallbackZod = (app) => {
  app.get("/employees", async () => {
    return db.select().from(schema.employees)
  })
}