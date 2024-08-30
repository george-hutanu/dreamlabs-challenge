import { faker } from '@faker-js/faker'

import { GetByInvoiceNumberQuery } from '~invoice/query'

describe('GetByInvoiceNumberQuery', () => {
  const invoiceNumber = faker.number.int({ min: 1, max: 10000 })

  it('should be defined', () => {
    const query = new GetByInvoiceNumberQuery(invoiceNumber)

    expect(query).toBeDefined()
  })

  it('should correctly assign the invoiceNumber property', () => {
    const query = new GetByInvoiceNumberQuery(invoiceNumber)

    expect(query.invoiceNumber).toBe(invoiceNumber)
  })
})
