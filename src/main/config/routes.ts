import { Express, Router } from 'express'
import fs from 'fs'
import path from 'path'

const PREFIX = '/api'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use(PREFIX, router)

  const files = await fs.readdirSync(path.resolve(__dirname, '../', 'routes'))
  files
    .filter(file => file.match(/\**-routes.ts/))
    .map(async file => (await import(`../routes/${file}`)).default(router))
}
