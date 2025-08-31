import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { eq } from "drizzle-orm";
import { env } from "../env";

type JwtPayload = {
  id: string; 
};

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.cookies.token;

  if (!token) {
    return reply.status(401).send({ error: "Não autorizado!" });
  }

  try {
    const { id } = jwt.verify(token, env.JWT_SECRET ?? "") as JwtPayload;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });

    if (!user) {
      return reply.status(401).send({ error: "Usuário não encontrado!" });
    }

    const { password: _, ...loggedUser } = user;

    request.user = loggedUser;

  } catch (error) {
    return reply.status(401).send({ error: "Token inválido!" });
  }
}
