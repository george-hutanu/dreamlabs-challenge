import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CreateHandler } from '~customer/commands/handlers'
import { Customer } from '~customer/customer.entity'
import { CustomerResolver } from '~customer/customer.resolver'
import { CustomerService } from '~customer/customer.service'
import { GetCustomerHandler } from '~customer/queries/handlers/get-one.handler'
import { CustomerIdConstraint } from '~libs/constraints'

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CqrsModule],
  providers: [CustomerService, CustomerResolver, CustomerIdConstraint, CreateHandler, GetCustomerHandler],
  exports: [CustomerService, CustomerIdConstraint],
})
export class CustomerModule {}
