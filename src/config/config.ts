import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import z from 'zod'

config({
  path: '.env'
})

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('No .env file found. Using .env.example file')
  process.exit(1)
}

const configSchema = z.object({
  APP_NAME: z.string(),
  APP_URL: z.string(),
  APP_PORT: z.string(),
  API_PREFIX: z.string(),
  APP_CORS_ORIGIN: z.string(),
  DATABASE_URI: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string()
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error('Config validation error')
  process.exit(1)
}

const envConfig = configServer.data

export default envConfig
