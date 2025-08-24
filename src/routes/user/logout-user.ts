import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

export const logoutUser: FastifyPluginCallbackZod = (app) => {
  app.post("/logout", async (request, response) => {
    response
      .clearCookie("token", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .status(200)
      .send({ message: "Logout realizado com sucesso" });
  });
};
