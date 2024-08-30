import { ICommand } from '@nestjs/cqrs'

export class MarkAsUnpaidCommand implements ICommand {
  public constructor(public readonly id: string) {}
}
