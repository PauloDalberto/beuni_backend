import { FastifyInstance } from "fastify";
import { createOrganization } from "./organization/create-organization";
import { getOrganization } from "./organization/get-organization";
import { createUser } from "./user/create-user";
import { loginUser } from "./user/login-user";
import { createDepartment } from "./department/create-department";
import { getDepartment } from "./department/get-department";
import { createEmployee } from "./employee/create-employee";
import { getEmployee } from "./employee/get-employee";
import { createAddress } from "./address/create-address";
import { getAddress } from "./address/get-address";

export async function registerRoutes(app: FastifyInstance) {
  app.register(createOrganization)
  app.register(getOrganization)

  app.register(createUser)
  app.register(loginUser)

  app.register(createDepartment)
  app.register(getDepartment)

  app.register(createEmployee)
  app.register(getEmployee)

  app.register(createAddress)
  app.register(getAddress)
}