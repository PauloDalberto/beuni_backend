import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { BadRequestError } from "../helpers/api-error";

type Role = "admin" | "manager" | "user";

export function authorize(roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const orgId =
      (request.body as any)?.organization_id ||
      (request.query as any)?.organization_id;

    if (!orgId) {
      throw new BadRequestError("Organization ID is required")
    }

    const userOrg = await db.query.usersOrganizations.findFirst({
      where: and(
        eq(schema.usersOrganizations.userId, (request.user as any).id),
        eq(schema.usersOrganizations.organizationId, orgId)
      ),
    });

    if (!userOrg || !roles.includes(userOrg.role as Role)) {
      return reply.status(403).send({ error: "Access denied!" });
    }
  };
}
