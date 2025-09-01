import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";

export const getRole: FastifyPluginCallbackZod = (app) => {
  app.get("/roles", {
    preHandler: [authMiddleware]
  }, 
  async (request, response) => {
    const user_id = request.user.id;

    if (!user_id) {
      throw new Error("userId is missing!");
    }

    const userRoles = await db.select({
      organizationId: schema.usersOrganizations.organizationId,
      role: schema.usersOrganizations.role,
    })
    .from(schema.usersOrganizations)
    .where(
      eq(schema.usersOrganizations.userId, user_id)
    )

    return response.status(200).send(userRoles)
  })
}