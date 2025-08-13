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
        month: z.string()
      })
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { month } = request.query;
    const organization_id = request.user.organization_id;

    if (!organization_id) {
      throw new BadRequestError("Organization ID missing in user");
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