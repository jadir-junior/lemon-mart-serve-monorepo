import { Router } from 'express'
import { router as apiV1 } from './v1'

const api = Router()

api.use('/v1', apiV1)

export { api }
