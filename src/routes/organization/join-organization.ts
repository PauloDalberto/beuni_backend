import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { BadRequestError } from "../../helpers/api-error";
import { and, eq, sql } from "drizzle-orm";

export const joinOrganization: FastifyPluginCallbackZod = (app) => {
  app.post("/organizations/:orgId/join", {
    schema: {
      body: z.object({
        userId: z.uuid(),
      }),
      params: z.object({
        orgId: z.uuid(),
      }),
    },
  }, 
  async (request, response) => {
    const { orgId } = request.params;
    const { userId } = request.body;

    const org = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, orgId),
    });
    if (!org) throw new BadRequestError("Organização não encontrada");

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) {
      throw new BadRequestError("Usuário não encontrado");
    }

    const already = await db.query.usersOrganizations.findFirst({
      where: and(
        eq(schema.usersOrganizations.userId, userId),
        eq(schema.usersOrganizations.organizationId, orgId)
      ),
    });

    if (already) {
      throw new BadRequestError("Usuário já faz parte da organização");
    }

    const [userOrg] = await db
      .insert(schema.usersOrganizations)
      .values({
        userId,
        organizationId: orgId,
        role: "user", 
      })
      .returning();

    return response.status(201).send({ membership: userOrg });
  });
};