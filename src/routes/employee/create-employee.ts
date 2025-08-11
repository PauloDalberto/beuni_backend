import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { authMiddleware } from "../../middlewares/auth";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { BadRequestError } from "../../helpers/api-error";

export const createEmployee: FastifyPluginCallbackZod = (app) => {
  app.post("/employees", {
    schema: {
      body: z.object({
        name: z.string().min(1),
        department_id: z.uuid(),
        birth_date: z.coerce.date().refine(d => !isNaN(d.getTime()), {
          message: "Invalid date format"
        }),
        job_title: z.string().min(1)
      })
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { birth_date, department_id, job_title, name } = request.body;
    const organization_id = request.user.organization_id;

    if(!organization_id){
      throw new BadRequestError("Organization ID missing in user")
    }

    const departmentExists = await db.query.departments.findFirst({
      where: and(
        eq(schema.departments.id, department_id),
        eq(schema.departments.organization_id, organization_id)
      )
    });

    if (!departmentExists) {
      throw new BadRequestError("Department does not exist in this organization");
    }

    const [newEmployee] = await db.insert(schema.employees).values({
      name,
      job_title,
      birth_date: birth_date.toISOString().split("T")[0],
      organization_id,
      department_id
    }).returning()

    return response.status(201).send(newEmployee)
  })
}