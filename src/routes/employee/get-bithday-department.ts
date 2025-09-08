import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { authMiddleware } from "../../middlewares/auth";
import z from "zod";
import { BadRequestError } from "../../helpers/api-error";
import { sql, and, eq, getTableColumns } from "drizzle-orm";
import { authorize } from "../../middlewares/authorize";

export const getBirthdayDepartment: FastifyPluginCallbackZod = (app) => {
  app.get("/employees/birthdays/department", {
    schema: {
      querystring: z.object({
        department_id: z.uuid(),
        organization_id: z.uuid()
      })
    },
    preHandler: [authMiddleware, authorize(['admin', 'manager', 'user'])]
  },
  async (request, response) => {
    const { department_id, organization_id } = request.query;

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

    if (!organization_id) {
      throw new BadRequestError("Organization ID missing in user");
    }

    const employeeColumns = getTableColumns(schema.employees)

    const getDepartment = await db.select({
      ...employeeColumns,
      name: schema.users.name
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