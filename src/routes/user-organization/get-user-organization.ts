import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../../middlewares/auth";
import { NotFoundError } from "../../helpers/api-error";

export const getUserOrganizations: FastifyPluginCallbackZod = (app) => {
  app.post("/user/organizations", {
    schema: {
      body: z.object({
        user_id: z.uuid()
      })
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { user_id } = request.body;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, user_id)
    });

    if(!user){
      throw new NotFoundError("User doesnt exists")
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