import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection";
import { schema } from "../../db/schema";
import { UnauthorizedError } from "../../helpers/api-error";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from "../../env";

export const loginUser: FastifyPluginCallbackZod = (app) => {
  app.post("/login", {
    schema: {
      body: z.object({
        email: z.email(),
        password: z.string().min(1),
      })
    }
  },
  async (request, response) => {
    const { email, password } = request.body;

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1)

    if (!user) {
      throw new UnauthorizedError("Invalid Credentials")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid Credentials")
    }

    const token = jwt.sign(
      { id: user.id },
      env.JWT_SECRET ?? 'fallback-secret',
      { expiresIn: '1h' }
    )

    const { password: _, ...userWithoutPassword } = user;

    response
      .setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60
      })
      .status(200)
      .send({ message: 'Login Success', token, user: userWithoutPassword })
  })
}