import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { authMiddleware } from "../../middlewares/auth";
import z from "zod";
import { BadRequestError } from "../../helpers/api-error";
import { sql, and, eq, getTableColumns } from "drizzle-orm";

export const getBirthdayDepartment: FastifyPluginCallbackZod = (app) => {
  app.get("/employees/birthdays/department", {
    schema: {
      querystring: z.object({
        department_id: z.uuid()
      })
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { department_id } = request.query;
    const organization_id = request.user.organization_id;

    if (!organization_id) {
      throw new BadRequestError("Organization ID missing in user");
    }

    const employeeColumns = getTableColumns(schema.employees)

    const getDepartment = await db.select({
      ...employeeColumns,
      user_name: schema.users.name
    }).from(schema.employees)
      .innerJoin(schema.users, eq(schema.users.id, schema.employees.user_id))
      .where(and(
        eq(schema.employees.organization_id, organization_id),
        eq(schema.employees.department_id, department_id),
      ))
      .orderBy(
        sql`EXTRACT(MONTH FROM ${schema.employees.birth_date}) ASC, 
            EXTRACT(DAY FROM ${schema.employees.birth_date}) ASC`
      )
      
    return response.status(200).send(getDepartment)
  })
}