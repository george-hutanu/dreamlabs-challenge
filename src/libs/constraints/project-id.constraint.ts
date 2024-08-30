import { Injectable } from '@nestjs/common'
import { ValidatorConstraint } from 'class-validator'

import { AbstractConstraint } from '~libs/constraints/abstract.constraint'
import { ProjectService } from '~project/project.service'

@Injectable()
@ValidatorConstraint({ name: 'projectIdExists', async: true })
export class ProjectIdConstraint extends AbstractConstraint<string> {
  protected errorMessage!: string

  public constructor(private readonly service: ProjectService) {
    super()
  }

  public async validate(id: string): Promise<boolean> {
    this.errorMessage = `Project with id: ${id} does not exist`
    const entity = await this.service.findOneById(id)
    return Boolean(entity)
  }
}
