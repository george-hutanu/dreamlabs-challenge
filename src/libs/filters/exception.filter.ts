import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { GraphQLError } from 'graphql/error'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const gqlHost = GqlArgumentsHost.create(host)

    if (host.getType<GqlContextType>() === 'graphql') {
      this.handleGraphql(exception, gqlHost)
    } else {
      this.handleHttp(exception, host)
    }
  }

  private handleHttp(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorMessage: exception.message,
    })
  }

  private handleGraphql(exception: HttpException, gqlHost: GqlArgumentsHost): void {
    throw new GraphQLError(exception.message, {
      extensions: {
        code: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: gqlHost.getInfo().path?.key,
        originalError: exception.getResponse(),
      },
    })
  }
}
