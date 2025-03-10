import envConfig from '@/config/config'
import setupSwagger from '@/config/swagger.config'
import { RequestMethod, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  //CORS
  const corsOrigin = envConfig.APP_CORS_ORIGIN
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true
  })
  console.info('CORS Origin:', corsOrigin)

  // Use global prefix if you don't have subdomain
  app.setGlobalPrefix(envConfig.API_PREFIX, {
    exclude: [
      { method: RequestMethod.GET, path: '/' },
      { method: RequestMethod.GET, path: 'health' }
    ]
  })

  //version
  app.enableVersioning({
    type: VersioningType.URI
  })

  //swagger
  setupSwagger(app)

  await app.listen(envConfig.APP_PORT)

  console.info(`Server running on ${await app.getUrl()}`)

  return app
}
bootstrap()
