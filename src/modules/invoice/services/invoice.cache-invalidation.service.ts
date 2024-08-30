import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { Cache } from 'cache-manager'

import { InvoiceCacheTokens } from '~libs/constants'
import { InvoiceEvents } from '~libs/events'

@Injectable()
export class CacheInvalidationService {
  public constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @OnEvent(InvoiceEvents.INVOICE_CREATED)
  @OnEvent(InvoiceEvents.INVOICE_UPDATED)
  @OnEvent(InvoiceEvents.INVOICE_PAID)
  @OnEvent(InvoiceEvents.INVOICE_UNPAID)
  @OnEvent(InvoiceEvents.INVOICE_REVERSED)
  public async handleInvoiceEvent(): Promise<void> {
    await this.cacheManager.del(InvoiceCacheTokens.GET_INVOICES)
  }
}
