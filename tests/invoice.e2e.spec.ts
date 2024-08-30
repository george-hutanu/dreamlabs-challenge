import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'

import { AppModule } from '~/app.module'
import { InvoiceCurrency } from '~libs/constants'

describe('InvoiceResolver (e2e)', () => {
  let app: INestApplication
  let invoiceId: string = ''
  let invoiceNumber: number = 1337
  const amount = faker.number.int({ max: 999 })
  const graphqlEndpoint = '/graphql'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a new invoice', () => {
    return request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({
        query: `
          mutation {
            createInvoice(createInvoiceData: { amount: ${amount}, currency: "${faker.helpers.enumValue(InvoiceCurrency)}" }) {
              id
              amount
              invoiceNumber
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        invoiceId = res.body.data.createInvoice.id
        invoiceNumber = res.body.data.createInvoice.invoiceNumber
        expect(res.body.data.createInvoice).toBeDefined()
        expect(res.body.data.createInvoice.amount).toBe(amount)
      })
  })

  it('should get all invoices', () => {
    return request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({
        query: `
          query {
            getInvoices(limit: 10) {
              id
              amount
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.getInvoices).toBeDefined()
        expect(res.body.data.getInvoices.length).toBeGreaterThan(0)
      })
  })

  it('should get an invoice by invoice number', () => {
    return request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({
        query: `
          query {
            getInvoiceByInvoiceNumber(invoiceNumber: ${invoiceNumber}) {
              id
              invoiceNumber
            }
          }
        `,
      })
      .expect((res) => {
        expect(res.body.data.getInvoiceByInvoiceNumber).toBeDefined()
        expect(res.body.data.getInvoiceByInvoiceNumber.invoiceNumber).toBe(invoiceNumber)
      })
  })

  it('should update an invoice', () => {
    return request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({
        query: `
          mutation {
            updateInvoice(updateInvoiceData: { id: "${invoiceId}", amount: ${amount} }) {
              id
              amount
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.updateInvoice).toBeDefined()
        expect(res.body.data.updateInvoice.amount).toBe(amount)
      })
  })

  it('should mark an invoice as paid', () => {
    return request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({
        query: `
          mutation {
            markInvoiceAsPaid(idPayload: { id: "${invoiceId}" }) {
              id
              status
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.markInvoiceAsPaid).toBeDefined()
        expect(res.body.data.markInvoiceAsPaid.status).toBe('PAID')
      })
  })

  it('should mark an invoice as unpaid', () => {
    return request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({
        query: `
          mutation {
            markInvoiceAsUnpaid(idPayload: { id: "${invoiceId}" }) {
              id
              status
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.markInvoiceAsUnpaid).toBeDefined()
        expect(res.body.data.markInvoiceAsUnpaid.status).toBe('UNPAID')
      })
  })

  it('should reverse an invoice', () => {
    return request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({
        query: `
          mutation {
            reverseInvoice(idPayload: { id: "${invoiceId}" }) {
              id
              isStorno
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.reverseInvoice).toBeDefined()
        expect(res.body.data.reverseInvoice.isStorno).toBe(true)
      })
  })
})
