import { IQuery } from '@nestjs/cqrs'

export class GetManyQuery implements IQuery {
  public constructor(public readonly limit: number) {}
}
