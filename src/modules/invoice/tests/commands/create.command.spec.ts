import { faker } from '@faker-js/faker'

import { CreateCommand } from '~invoice/commands'
import { CreateInvoiceDTO } from '~invoice/commands/dtos'
import { InvoiceCurrency } from '~libs/constants'

describe('CreateCommand', () => {
  const createInvoiceDTO: CreateInvoiceDTO = {
    amount: faker.number.int({ max: 1000 }),
    currency: faker.helpers.enumValue(InvoiceCurrency),
  }

  it('should be defined', () => {
    const command = new CreateCommand(createInvoiceDTO)

    expect(command).toBeDefined()
  })

  it('should correctly assign the createInvoiceDTO property', () => {
    const command = new CreateCommand(createInvoiceDTO)

    expect(command.createInvoiceDTO).toBe(createInvoiceDTO)
  })
})
