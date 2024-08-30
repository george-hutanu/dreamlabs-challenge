import { ICommand } from '@nestjs/cqrs'

export class ReverseCommand implements ICommand {
  public constructor(public readonly id: string) {}
}
