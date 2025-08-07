import 'dotenv/config'

import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "./env";
import { errorMiddleware } from "./middlewares/error";
import { registerRoutes } from "./routes";
import cookie from '@fastify/cookie'

async function startServer(){
  const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  
  app.setSerializerCompiler(serializerCompiler);
  app.setValidatorCompiler(validatorCompiler);

  app.register(cookie, {
    secret: env.COOKIE_SECRET,
    hook: 'onRequest'
  })
  
  app.get('/health', () => {
    return 'OK';
  });
  
  await registerRoutes(app);

  app.setErrorHandler(errorMiddleware)

  app.listen({ port: env.PORT }).then(() => {
    console.log("Servidor Rodando")
  })
}

startServer();