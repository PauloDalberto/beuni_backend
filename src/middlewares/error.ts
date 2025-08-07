import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../helpers/api-error";

export function errorMiddleware(
  error: FastifyError & Partial<ApiError>,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : "Internal Server Errordsadsada";

  reply.status(statusCode).send({ message });
}
