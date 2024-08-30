import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config'
import { TypeOrmModule as TypeOrm } from '@nestjs/typeorm'

import { Customer } from '~customer/customer.entity'
import { Invoice } from '~invoice/invoice.entity'
import { InvoiceSubscriber } from '~invoice/invoice.typeorm.subscriber'
import { DB_CONFIG, DB_CONFIG_TOKEN } from '~libs/configuration'
import { Project } from '~project/project.entity'

@Module({
  imports: [
    TypeOrm.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<ConfigType<typeof DB_CONFIG>>(DB_CONFIG_TOKEN)!.host,
        port: config.get<ConfigType<typeof DB_CONFIG>>(DB_CONFIG_TOKEN)!.port,
        username: config.get<ConfigType<typeof DB_CONFIG>>(DB_CONFIG_TOKEN)!.username,
        password: config.get<ConfigType<typeof DB_CONFIG>>(DB_CONFIG_TOKEN)!.password,
        database: config.get<ConfigType<typeof DB_CONFIG>>(DB_CONFIG_TOKEN)!.database,
        synchronize: true,
        subscribers: [InvoiceSubscriber],
        entities: [Invoice, Customer, Project],
      }),
    }),
  ],
})
export class TypeOrmModule {}
