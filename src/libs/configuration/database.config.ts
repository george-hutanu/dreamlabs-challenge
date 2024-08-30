import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const DB_CONFIG_TOKEN = 'db'

export const DB_CONFIG = registerAs(DB_CONFIG_TOKEN, () => ({
  host: process.env['DB_HOST'],
  port: Number.parseInt(process.env['DB_PORT']!, 10),
  username: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_DATABASE'],
}))

export const databaseValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
})
