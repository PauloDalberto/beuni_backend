import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { authMiddleware } from "../../middlewares/auth";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { BadRequestError } from "../../helpers/api-error";
import { authorize } from "../../middlewares/authorize";

export const createGift: FastifyPluginCallbackZod = (app) => {
  app.post("/gifts", {
    schema: {
      body: z.object({
        employee_id: z.uuid(),
        gift_type: z.string(),
        send_date: z.coerce.date(),
        delivery_date: z.coerce.date().nullable().optional()
      })
    },
    preHandler: [authMiddleware, authorize(["admin", "manager"], false)]
  },
  async (request, response) => {
    const { delivery_date, employee_id, gift_type, send_date } = request.body;

    if (!request.user.id) {
      throw new BadRequestError("User ID is missing");
    }

    const employee = await db.query.employees.findFirst({
      where: eq(schema.employees.id, employee_id)
    });

    if (!employee) {
      throw new BadRequestError("Employee does not exist");
    }

    const userBelongsToOrg = await db.query.usersOrganizations.findFirst({
      where: and(
        eq(schema.usersOrganizations.userId, request.user.id),
        eq(schema.usersOrganizations.organizationId, employee.organization_id)
      )
    });

    if (!userBelongsToOrg) {
      throw new BadRequestError("You do not belong to this organization");
    }

    const [newGift] = await db.insert(schema.gifts).values({
      employee_id,
      organization_id: employee.organization_id,
      gift_type,
      send_date: send_date.toISOString().split("T")[0],
      delivery_date: delivery_date
        ? delivery_date.toISOString().split("T")[0]
        : null,
    }).returning();

    return response.status(201).send(newGift);
  });
};
