import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProjectIdConstraint } from '~libs/constraints/project-id.constraint'
import { CreateHandler } from '~project/commands/handlers'
import { Project } from '~project/project.entity'
import { ProjectResolver } from '~project/project.resolver'
import { ProjectService } from '~project/project.service'
import { GetOneHandler } from '~project/queries/handlers/get-one.handler'

@Module({
  imports: [TypeOrmModule.forFeature([Project]), CqrsModule],
  providers: [ProjectService, ProjectResolver, ProjectIdConstraint, CreateHandler, GetOneHandler],
  exports: [ProjectService, ProjectIdConstraint],
})
export class ProjectModule {}
