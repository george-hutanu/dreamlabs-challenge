import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { GraphQLModule } from '@nestjs/graphql'
import { ThrottlerModule } from '@nestjs/throttler'
import { join } from 'path'

import { AppController } from '~/app.controller'
import { AppService } from '~/app.service'
import { CustomerModule } from '~customer/customer.module'
import { InvoiceModule } from '~invoice/invoice.module'
import * as config from '~libs/configuration'
import { LoggingInterceptor } from '~libs/interceptors'
import { TypeOrmModule } from '~libs/modules/database/type-orm/type-orm.module'
import { ProjectModule } from '~project/project.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config.APP_CONFIG, config.DB_CONFIG],
      validationSchema: config.appValidationSchema.concat(config.databaseValidationSchema),
    }),
    TypeOrmModule,
    CustomerModule,
    InvoiceModule,
    ProjectModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      path: '/graphql',
      driver: ApolloDriver,
      playground: true,
      csrfPrevention: false,
      autoSchemaFile: join(__dirname, '../schema.gql'),
      sortSchema: true,
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      ignoreErrors: false,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    Reflector,
  ],
})
export class AppModule {}
