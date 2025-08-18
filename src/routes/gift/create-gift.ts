import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { authMiddleware } from "../../middlewares/auth";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { BadRequestError } from "../../helpers/api-error";

export const createGift: FastifyPluginCallbackZod = (app) => {
  app.post("/gifts", {
    schema: {
      body: z.object({
        employee_id: z.uuid(),
        gift_type: z.string(),
        organization_id: z.uuid(),
        send_date: z.coerce.date(),
        delivery_date: z.coerce.date()
      })
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { delivery_date, employee_id, gift_type, send_date, organization_id } = request.body;

    const orgExists = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, organization_id)
    });

    if (!orgExists) {
      throw new BadRequestError("Organization does not exist");
    }

    if (!request.user.id) {
      throw new BadRequestError("User ID is missing");
    }

    const userBelongsToOrg = await db.query.usersOrganizations.findFirst({
      where: and(
        eq(schema.usersOrganizations.userId, request.user.id),
        eq(schema.usersOrganizations.organizationId, organization_id)
      )
    });

    if (!userBelongsToOrg) {
      throw new BadRequestError("You do not belong to this organization");
    }

    const employeeExists = await db.query.employees.findFirst({
      where: and(
        eq(schema.employees.id, employee_id),
        eq(schema.employees.organization_id, organization_id)
      )
    });

    if (!employeeExists) {
      throw new BadRequestError("Employee does not exist in your organization");
    }

    const [newGift] = await db.insert(schema.gifts).values({
      employee_id,
      organization_id,
      gift_type,
      send_date: send_date.toISOString().split("T")[0],
      delivery_date: delivery_date ? delivery_date.toISOString().split("T")[0] : null,
    }).returning();

    return response.status(201).send(newGift);
  })
}