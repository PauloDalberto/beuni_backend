import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { authMiddleware } from "../../middlewares/auth";
import z from "zod";
import { db } from "../../db/connection";
import { NotFoundError } from "../../helpers/api-error";
import { eq } from "drizzle-orm";
import { schema } from "../../db/schema";

export const uptadeGift: FastifyPluginCallbackZod = (app) => {
  app.patch("/gifts/:id", {
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
      body: z.object({
        gift_type: z.string().optional(),
        status: z.enum(["pending", "sent", "delivered"]).optional(),
        send_date: z.coerce.date().optional(),
        delivery_date: z.coerce.date().optional(),
      }),
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { id } = request.params;
    const updateData = request.body;

    const gift = await db.query.gifts.findFirst({
      where: eq(schema.gifts.id, id),
    });

    if (!gift) {
      throw new NotFoundError("Gift not found");
    }

    const formattedUpdateData = {
      ...updateData,
      send_date: updateData.send_date ? updateData.send_date.toISOString().split("T")[0] : undefined,
      delivery_date: updateData.delivery_date ? updateData.delivery_date.toISOString().split("T")[0] : undefined,
    };

    const [updatedGift] = await db
      .update(schema.gifts)
      .set(formattedUpdateData)
      .where(eq(schema.gifts.id, id))
      .returning();

    return response.send(updatedGift);
  })
}