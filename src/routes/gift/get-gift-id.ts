import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import z from "zod";
import { authMiddleware } from "../../middlewares/auth";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../helpers/api-error";
import { authorize } from "../../middlewares/authorize";

export const getGiftId: FastifyPluginCallbackZod = (app) => {
  app.get("/gifts/:id", {
    schema: {
      params: z.object({
        id: z.uuid(),
      })
    },
    preHandler: [authMiddleware, authorize(['admin', 'manager', 'user'])]
  },
  async (request, response) => {
    const { id } = request.params;

    const gift = await db.query.gifts.findFirst({
      where: eq(schema.gifts.id, id)
    })    

    if(!gift){
      throw new NotFoundError("Gift ot found")
    }

    return response.send(gift)
  })
}