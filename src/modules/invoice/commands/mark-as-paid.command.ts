import { ICommand } from '@nestjs/cqrs'

export class MarkAsPaidCommand implements ICommand {
  public constructor(public readonly id: string) {}
}
