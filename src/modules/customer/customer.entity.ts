import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'

import { Invoice } from '~invoice/invoice.entity'
import { BaseEntity } from '~libs/entities'

@Entity()
@ObjectType()
export class Customer extends BaseEntity {
  @Column()
  @Field()
  public name: string

  @OneToMany(() => Invoice, (invoice) => invoice.customer, { nullable: true })
  @Field(() => [Invoice])
  public invoices: Invoice[]
}
