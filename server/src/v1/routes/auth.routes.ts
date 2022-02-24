import { Request, Response, Router } from 'express'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }

  return res.status(200).json({ email: email.toLowerCase() })
})

export { router }
