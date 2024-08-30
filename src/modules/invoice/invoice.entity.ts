import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne } from 'typeorm'

import { Customer } from '~customer/customer.entity'
import { InvoiceCurrency, InvoiceStatus } from '~libs/constants'
import { BaseEntity } from '~libs/entities'
import { Project } from '~project/project.entity'

@Entity()
@ObjectType()
export class Invoice extends BaseEntity {
  @Column()
  @Field(() => Int)
  public invoiceNumber: number

  @Column()
  @Field()
  public date: Date

  @Column({ enum: InvoiceCurrency })
  @Field()
  public currency: InvoiceCurrency

  @Column('decimal')
  @Field()
  public amount: number

  @Column({ enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
  @Field()
  public status: InvoiceStatus

  @Column({ default: false })
  @Field({ defaultValue: false })
  public isStorno: boolean

  @ManyToOne(() => Customer, (customer) => customer.invoices, { nullable: true })
  @Field(() => Customer)
  public customer: Customer

  @ManyToOne(() => Project, (project) => project.invoices, { nullable: true })
  @Field(() => Project)
  public project: Project
}
