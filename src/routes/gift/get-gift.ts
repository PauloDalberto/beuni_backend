import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";

export const getGift: FastifyPluginCallbackZod = (app) => {
  app.get("/gifts", async () => {
    return db.select().from(schema.gifts)
  })
}