import { FastifyInstance } from "fastify";
import { createOrganization } from "./organization/create-organization";
import { getOrganization } from "./organization/get-organization";
import { createUser } from "./user/create-user";
import { loginUser } from "./user/login-user";
import { createDepartment } from "./department/create-department";
import { getDepartment } from "./department/get-department";

export async function registerRoutes(app: FastifyInstance) {
  app.register(createOrganization)
  app.register(getOrganization)

  app.register(createUser)
  app.register(loginUser)

  app.register(createDepartment)
  app.register(getDepartment)
}