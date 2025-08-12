import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { BadRequestError } from "../../helpers/api-error";
import { authMiddleware } from "../../middlewares/auth";
import { and, eq } from "drizzle-orm";

export const createAddress: FastifyPluginCallbackZod = (app) => {
  app.post("/addresses", {
    schema: {
      body: z.object({
        cep: z.string(),
        street: z.string(),
        city: z.string(),
        number: z.string(),
        complement: z.string(),
        neighborhood: z.string(),
        state: z.string(),
        employee_id: z.uuid(),
      })
    },
    preHandler: [authMiddleware]
  },
  async (request, response) => {
    const { cep, complement, employee_id, neighborhood, number, state, street, city } = request.body;  

    const employeeExists = await db.query.employees.findFirst({
      where: eq(schema.employees.id, employee_id)
    });

    if(!employeeExists){
      throw new BadRequestError("The employee not exists");
    }

    const [newAddress] = await db.insert(schema.addresses).values({
      cep,
      city,
      neighborhood,
      number,
      state,
      street,
      complement,
      employee_id
    }).returning()

    return response.status(201).send(newAddress)
  })
}