import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const APP_CONFIG_TOKEN = 'app'

export const APP_CONFIG = registerAs(APP_CONFIG_TOKEN, () => ({
  port: process.env['PORT'],
}))

export const appValidationSchema = Joi.object({
  PORT: Joi.number().required(),
})
