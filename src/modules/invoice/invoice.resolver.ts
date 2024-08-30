import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CreateCommand, MarkAsPaidCommand, MarkAsUnpaidCommand, ReverseCommand, UpdateCommand } from '~invoice/commands'
import { CreateInvoiceDTO, UpdateInvoiceDTO } from '~invoice/commands/dtos'
import { Invoice } from '~invoice/invoice.entity'
import { CreateUpdateAppointmentBodyPipe } from '~invoice/pipes'
import { GetByInvoiceNumberQuery, GetManyQuery } from '~invoice/query'
import { InvoiceDTO, InvoiceIdDTO } from '~invoice/query/dtos'
import { InvoiceCacheTokens, Time } from '~libs/constants'
import { Log } from '~libs/decorators'

@Injectable()
@Resolver(() => Invoice)
@Log()
export class InvoiceResolver {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [InvoiceDTO])
  @CacheKey(InvoiceCacheTokens.GET_INVOICES)
  @CacheTTL(Time.ONE_HOUR)
  public async getInvoices(@Args('limit') limit: number): Promise<Invoice[]> {
    return this.queryBus.execute(new GetManyQuery(limit))
  }

  @Query(() => InvoiceDTO)
  public async getInvoiceByInvoiceNumber(@Args('invoiceNumber') invoiceNumber: number): Promise<Invoice> {
    return this.queryBus.execute(new GetByInvoiceNumberQuery(invoiceNumber))
  }

  @Mutation(() => InvoiceDTO)
  public async createInvoice(
    @Args('createInvoiceData', CreateUpdateAppointmentBodyPipe) createInvoiceData: CreateInvoiceDTO,
  ): Promise<Invoice> {
    return this.commandBus.execute(new CreateCommand(createInvoiceData))
  }

  @Mutation(() => InvoiceDTO)
  public async updateInvoice(
    @Args('updateInvoiceData', CreateUpdateAppointmentBodyPipe) updateInvoiceData: UpdateInvoiceDTO,
  ): Promise<Invoice> {
    return this.commandBus.execute(new UpdateCommand(updateInvoiceData))
  }

  @Mutation(() => InvoiceDTO)
  public async markInvoiceAsPaid(@Args('idPayload') { id }: InvoiceIdDTO): Promise<Invoice> {
    return this.commandBus.execute(new MarkAsPaidCommand(id))
  }

  @Mutation(() => InvoiceDTO)
  public async markInvoiceAsUnpaid(@Args('idPayload') { id }: InvoiceIdDTO): Promise<Invoice> {
    return this.commandBus.execute(new MarkAsUnpaidCommand(id))
  }

  @Mutation(() => InvoiceDTO)
  public async reverseInvoice(@Args('idPayload') { id }: InvoiceIdDTO): Promise<Invoice> {
    return this.commandBus.execute(new ReverseCommand(id))
  }
}
