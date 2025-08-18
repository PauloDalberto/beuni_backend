import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { authMiddleware } from "../../middlewares/auth";
import z from "zod";
import { BadRequestError } from "../../helpers/api-error";
import { sql, and, eq, getTableColumns } from "drizzle-orm";

export const getBirthdayMonth: FastifyPluginCallbackZod = (app) => {
  app.get("/employees/birthdays/month", {
    schema: {
      querystring: z.object({
        month: z.string(),
        organization_id: z.uuid()
      })
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { month, organization_id } = request.query;

    if (!request.user.id) {
      throw new BadRequestError("User ID is missing");
    }

    const userOrgs = await db.query.usersOrganizations.findFirst({
      where: and(
        eq(schema.usersOrganizations.userId, request.user.id),
        eq(schema.usersOrganizations.organizationId, organization_id)
      )
    });

    if (!userOrgs) {
      throw new BadRequestError("User does not belong to this organization");
    }

    const employeeColumns = getTableColumns(schema.employees)

    const monthNumber = Number(month);
    const getMonth = await db.select({
      ...employeeColumns,
      user_name: schema.users.name
    }).from(schema.employees)
      .innerJoin(schema.users, eq(schema.users.id, schema.employees.user_id))
      .where(
        and(
          sql`EXTRACT(MONTH FROM ${schema.employees.birth_date}) = ${monthNumber}`,
          eq(schema.employees.organization_id, organization_id)
        )
      )
      .orderBy(sql`EXTRACT(DAY FROM ${schema.employees.birth_date}) asc`)

    return response.status(200).send(getMonth)
  })
}