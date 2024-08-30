import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import helmet from 'helmet'

import { AppModule } from '~/app.module'
import { HttpExceptionFilter } from '~libs/filters'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  await app.listen(Number(process.env.PORT) || 3000)
}

bootstrap()
