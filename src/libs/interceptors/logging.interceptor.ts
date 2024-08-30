import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable, tap } from 'rxjs'

import { CLASS_LOGGING_KEY } from '~libs/decorators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name)

  public constructor(private readonly reflector: Reflector) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isClassLoggingEnabled = this.reflector.get<boolean>(CLASS_LOGGING_KEY, context.getClass())

    if (!isClassLoggingEnabled) {
      return next.handle()
    }

    const gqlContext = GqlExecutionContext.create(context)
    const info = gqlContext.getInfo()
    const start = Date.now()

    if (!info) {
      this.logger.error('GraphQL info is undefined.')
      return next.handle()
    }

    this.logger.log(`Handling ${info.fieldName}`)

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          const timeTaken = Date.now() - start
          if (data instanceof Array && data.length > 10) {
            this.logger.log(`Handled ${info.fieldName} in ${timeTaken}ms with result: ${data.length} items`)
          } else {
            this.logger.log(`Handled ${info.fieldName} in ${timeTaken}ms with result: ${JSON.stringify(data)}`)
          }
        },
        error: (error: Error) => {
          const timeTaken = Date.now() - start
          this.logger.error(`Failed to handle ${info.fieldName} in ${timeTaken}ms`, error.stack)
        },
      }),
    )
  }
}
