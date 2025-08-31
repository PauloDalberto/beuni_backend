import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";

export const getUserOrganizations: FastifyPluginCallbackZod = (app) => {
  app.get("/user/organizations", {
    preHandler: [authMiddleware, authorize(['admin', 'manager', 'user'])]
  }, 
  async (request, response) => {
    const user_id = request.user.id;

    if (!user_id) {
      throw new Error("userId is missing!");
    }

    const userOrgs = await db.select({
      orgId: schema.organizations.id,
      orgName: schema.organizations.name,
    })
    .from(schema.usersOrganizations)
    .innerJoin(
      schema.organizations,
      eq(schema.usersOrganizations.organizationId, schema.organizations.id)
    )
    .where(
      eq(schema.usersOrganizations.userId, user_id)
    )

    return response.send(userOrgs)
  })
}