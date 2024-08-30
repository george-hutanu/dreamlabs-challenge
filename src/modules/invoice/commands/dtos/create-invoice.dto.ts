import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, Validate } from 'class-validator'

import { Customer } from '~customer/customer.entity'
import { InvoiceCurrency, InvoiceStatus } from '~libs/constants'
import { CustomerIdConstraint } from '~libs/constraints'
import { ProjectIdConstraint } from '~libs/constraints/project-id.constraint'
import { Project } from '~project/project.entity'

@InputType()
export class CreateInvoiceDTO {
  @Field({ nullable: true, defaultValue: new Date() })
  @IsDate()
  @IsOptional()
  public readonly date?: Date

  @Field()
  @IsEnum(InvoiceCurrency)
  @IsNotEmpty()
  public readonly currency: InvoiceCurrency

  @Field()
  @IsNumber()
  @IsNotEmpty()
  public readonly amount: number

  @Field({ defaultValue: InvoiceStatus.UNPAID, nullable: true })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  public readonly status?: InvoiceStatus

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  public readonly isStorno?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @Validate(CustomerIdConstraint)
  public customerId?: string

  @Field({ nullable: true })
  @IsOptional()
  @Validate(ProjectIdConstraint)
  public projectId?: string

  public customer?: Customer
  public project?: Project
}
