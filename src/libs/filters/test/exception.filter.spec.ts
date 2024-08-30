import { ArgumentsHost, HttpException } from '@nestjs/common'
import { GqlArgumentsHost } from '@nestjs/graphql'
import { Test, TestingModule } from '@nestjs/testing'
import { GraphQLError } from 'graphql'

import { HttpExceptionFilter } from '~libs/filters'

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile()

    jest.spyOn(GqlArgumentsHost, 'create').mockImplementation(() => ({}) as any)

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter)
  })

  it('should handle HTTP exception', () => {
    const mockException = new HttpException('Test error', 400)
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const mockRequest = {
      url: '/test',
    }
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      getType: jest.fn().mockReturnValue('http'),
    } as unknown as ArgumentsHost

    filter.catch(mockException, mockArgumentsHost)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      timestamp: expect.any(String),
      path: '/test',
      errorMessage: 'Test error',
    })
  })

  it('should handle GraphQL exception', () => {
    const mockException = new HttpException('Test error', 400)
    const mockGqlArgumentsHost = {
      getInfo: jest.fn().mockReturnValue({
        path: { key: 'testQuery' },
      }),
    } as unknown as GqlArgumentsHost

    jest.spyOn(GqlArgumentsHost, 'create').mockReturnValue(mockGqlArgumentsHost as any)

    const mockArgumentsHost = {
      getType: jest.fn().mockReturnValue('graphql'),
    } as unknown as ArgumentsHost

    expect(() => filter.catch(mockException, mockArgumentsHost)).toThrow(GraphQLError)
  })
})
