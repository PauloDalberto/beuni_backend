import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { BadRequestError } from "../../helpers/api-error";
import { and, eq } from "drizzle-orm";
import { authMiddleware } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";

export const uptadeRoleUser: FastifyPluginCallbackZod = (app) => {
  app.put("/user/role", {
    schema: {
      body: z.object({
        user_id: z.uuid(),
        organization_id: z.uuid(),
        newRole: z.enum(schema.userRoles.enumValues)
      })
    },
    preHandler: [authMiddleware, authorize(['admin'])]
  },
  async (request, response) => {
    const { user_id, newRole, organization_id } = request.body;

    const orgExists = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, organization_id)
    });

    if(!orgExists) {
      throw new BadRequestError("Organization name not exists");
    }

    const userExists = await db.query.usersOrganizations.findFirst({
      where: and(
        eq(schema.usersOrganizations.userId, user_id),
        eq(schema.usersOrganizations.organizationId, organization_id)
      )
    });

    if (!userExists) {
      throw new BadRequestError("User does not exist in this organization");
    }

    await db.update(schema.usersOrganizations)
    .set({ role: newRole })
    .where(and(
      eq(schema.usersOrganizations.userId, user_id),
      eq(schema.usersOrganizations.organizationId, organization_id),
    ))

    return response.status(204).send()
  })
}