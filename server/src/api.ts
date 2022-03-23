import { Router } from 'express'

import { router as apiV1 } from './v1'
import { router as apiv2 } from './v2'

const api = Router()

api.use('/v1', apiV1)
api.use('/v2', apiv2)

export { api }
