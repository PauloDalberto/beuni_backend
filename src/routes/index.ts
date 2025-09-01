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
import { getGift } from "./gift/get-gift";
import { getGiftId } from "./gift/get-gift-id";
import { createGift } from "./gift/create-gift";
import { uptadeGift } from "./gift/uptade-gift";
import { getBirthdayMonth } from "./employee/get-birthday-month";
import { getBirthdayDepartment } from "./employee/get-bithday-department";
import { getUserOrganizations } from "./user-organization/get-user-organization";
import { logoutUser } from "./user/logout-user";
import { uptadeRoleUser } from "./user/uptade-role-user";

export async function registerRoutes(app: FastifyInstance) {
  app.register(createOrganization)
  app.register(getOrganization)

  app.register(createUser)
  app.register(loginUser)
  app.register(logoutUser)
  app.register(uptadeRoleUser)

  app.register(createDepartment)
  app.register(getDepartment)

  app.register(createEmployee)
  app.register(getEmployee)
  app.register(getBirthdayMonth)
  app.register(getBirthdayDepartment)

  app.register(createAddress)
  app.register(getAddress)

  app.register(getGift)
  app.register(getGiftId)
  app.register(createGift)
  app.register(uptadeGift)

  app.register(getUserOrganizations)
}