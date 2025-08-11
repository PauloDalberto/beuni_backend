import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { BadRequestError } from "../../helpers/api-error";
import { authMiddleware } from "../../middlewares/auth";
import { and, eq } from "drizzle-orm";

export const createDepartment: FastifyPluginCallbackZod = (app) => {
  app.post("/departments", {
    schema: {
      body: z.object({
        name: z.string().min(1)
      })
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { name } = request.body;
    const organization_id = request.user.organization_id;

    if (!organization_id) {
      throw new BadRequestError("Organization ID missing in user");
    }

    const departmentExists = await db.query.departments.findFirst({
      where: and(
        eq(schema.departments.organization_id, organization_id),
        eq(schema.departments.name, name)
      )
    });

    if (departmentExists) {
      throw new BadRequestError("Department with this name already exists");
    }

    const [newDepartment] = await db.insert(schema.departments).values({
      name,
      organization_id
    }).returning()

    return response.status(201).send(newDepartment)
  })
}