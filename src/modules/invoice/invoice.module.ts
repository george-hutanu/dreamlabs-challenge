import { CacheModule } from '@nestjs/cache-manager'
import { Logger, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CustomerModule } from '~customer/customer.module'
import {
  CreateInvoiceHandler,
  MarkInvoiceAsPaidHandler,
  MarkInvoiceAsUnpaidHandler,
  ReverseInvoiceHandler,
  UpdateInvoiceHandler,
} from '~invoice/commands/handlers'
import { Invoice } from '~invoice/invoice.entity'
import { InvoiceEventsSubscriber } from '~invoice/invoice.events'
import { InvoiceResolver } from '~invoice/invoice.resolver'
import { InvoiceSubscriber } from '~invoice/invoice.typeorm.subscriber'
import { GetByInvoiceNumberHandler, GetManyHandler } from '~invoice/query/handlers'
import { CacheInvalidationService } from '~invoice/services/invoice.cache-invalidation.service'
import { InvoiceService } from '~invoice/services/invoice.service'
import { InvoiceIdConstraint } from '~libs/constraints/invoice-id.constraint'
import { ProjectModule } from '~project/project.module'

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), CustomerModule, ProjectModule, CqrsModule, CacheModule.register()],
  providers: [
    InvoiceService,
    InvoiceResolver,
    InvoiceIdConstraint,
    InvoiceSubscriber,
    InvoiceEventsSubscriber,
    Logger,
    CreateInvoiceHandler,
    UpdateInvoiceHandler,
    MarkInvoiceAsPaidHandler,
    MarkInvoiceAsUnpaidHandler,
    ReverseInvoiceHandler,
    GetManyHandler,
    GetByInvoiceNumberHandler,
    CacheInvalidationService,
  ],
  exports: [InvoiceService, InvoiceIdConstraint],
})
export class InvoiceModule {}
