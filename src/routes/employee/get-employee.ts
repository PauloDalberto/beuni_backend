import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import z from "zod";
import { authMiddleware } from "../../middlewares/auth";

export const getEmployee: FastifyPluginCallbackZod = (app) => {
  app.get("/employees/:organizationId", {
    schema: {
      params: z.object({
        organizationId: z.uuid(),
      }),
    },
    preHandler: [authMiddleware]
  }, async (request) => {
    const { organizationId } = request.params;
    const employeeColumns = getTableColumns(schema.employees)
    
    const employees = await db
      .select({
        ...employeeColumns,
        name: schema.users.name,
        email: schema.users.email,
        department: schema.departments.name
      })
      .from(schema.employees)
      .where(eq(schema.employees.organization_id, organizationId))
      .leftJoin(schema.users, eq(schema.employees.user_id, schema.users.id))
      .leftJoin(schema.departments, eq(schema.employees.department_id, schema.departments.id));

    return employees;
  });
};
