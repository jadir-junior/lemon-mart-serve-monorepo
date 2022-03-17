import { Router } from 'express'

import { router as userRouter } from './routes/user.router'

const router = Router()

// Configura all v2 routers here
router.use('/users?', userRouter)

export { router }
