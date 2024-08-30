import { GetManyQuery } from '~invoice/query'

describe('GetManyQuery', () => {
  it('should be defined', () => {
    const query = new GetManyQuery(1)

    expect(query).toBeDefined()
  })
})
