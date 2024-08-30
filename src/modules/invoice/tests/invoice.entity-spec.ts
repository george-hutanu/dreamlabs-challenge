import { faker } from '@faker-js/faker'

import { Invoice } from '~invoice/invoice.entity'
import { InvoiceCurrency, InvoiceStatus } from '~libs/constants'

export const InvoiceEntitySpec: Invoice = {
  id: faker.string.uuid(),
  amount: faker.number.int({ max: 1000 }),
  invoiceNumber: faker.number.int({ max: 1000 }),
  currency: faker.helpers.enumValue(InvoiceCurrency),
  date: faker.date.recent(),
  status: faker.helpers.enumValue(InvoiceStatus),
  isStorno: faker.datatype.boolean(),
  customer: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    invoices: [],
  },
  project: null,
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}
