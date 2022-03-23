import { Router } from 'express'

import { router as AuthRoutes } from './routes/auth.routes'

const router = Router()

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ServerMessage"
 *   schemas:
 *     ServerMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

router.use('/auth', AuthRoutes)

export { router }
