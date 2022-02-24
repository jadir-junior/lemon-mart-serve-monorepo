import express, { Application } from 'express'

import { api } from './api'
import cors from 'cors'
import logger from 'morgan'
import { specs } from './docs-config'
import swaggerUi from 'swagger-ui-express'

const app: Application = express()

app.use(
  cors({
    origin: '*',
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use(api)

export { app }
