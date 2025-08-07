import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { eq } from "drizzle-orm";

type JwtPayload = {
  id: string; // UUID em vez de number, assumindo que o id do user é UUID
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
    const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as JwtPayload;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });

    if (!user) {
      return reply.status(401).send({ error: "Usuário não encontrado!" });
    }

    // Remove a senha antes de anexar ao request
    const { password_hash: _, ...loggedUser } = user;

    // Anexar user ao request (precisa tipar depois)
    request.user = loggedUser;

  } catch (error) {
    return reply.status(401).send({ error: "Token inválido!" });
  }
}
