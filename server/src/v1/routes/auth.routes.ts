import { Request, Response, Router } from 'express'

import { UserCollection } from '../../models/user'
import {
  AuthenticationRequiredMessage,
  IncorrectEmailPasswordMessage,
  authenticate,
  createJwt,
} from '../../services/auth.service'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }
  const user = await UserCollection.findOne({ email: email.toLowerCase() })

  if (user && (await user.comparePassword(req.body.password))) {
    return res.send({ accessToken: await createJwt(user) })
  }

  return res.status(401).json({ message: IncorrectEmailPasswordMessage })
})

router.get('/me', authenticate(), async (_req: Request, res: Response) => {
  const { currentUser } = res.locals
  if (currentUser) {
    return res.send(currentUser)
  }

  return res.status(401).send({ message: AuthenticationRequiredMessage })
})

export { router }
