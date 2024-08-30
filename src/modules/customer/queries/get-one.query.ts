import { IQuery } from '@nestjs/cqrs'

export class GetOneQuery implements IQuery {
  public constructor(public readonly id: string) {}
}
