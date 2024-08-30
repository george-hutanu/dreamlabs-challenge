import { Field, ID } from '@nestjs/graphql'
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { ulid } from 'ulid'

export class BaseEntity {
  @PrimaryColumn({ type: 'text' })
  @Field(() => ID)
  public readonly id = ulid()

  @CreateDateColumn({ type: 'timestamp' })
  @Field()
  public readonly createdAt: string

  @UpdateDateColumn({ type: 'timestamp' })
  @Field()
  public readonly updatedAt: string
}
