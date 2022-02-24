import { router as AuthRoutes } from './routes/auth.routes'
import { Router } from 'express'

const router = Router()

router.use('/auth', AuthRoutes)

export { router }
