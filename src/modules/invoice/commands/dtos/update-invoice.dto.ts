import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Validate } from 'class-validator'

import { CreateInvoiceDTO } from '~invoice/commands/dtos/create-invoice.dto'
import { InvoiceIdConstraint } from '~libs/constraints/invoice-id.constraint'

@InputType()
export class UpdateInvoiceDTO extends PartialType(CreateInvoiceDTO) {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Validate(InvoiceIdConstraint)
  public id: string
}
