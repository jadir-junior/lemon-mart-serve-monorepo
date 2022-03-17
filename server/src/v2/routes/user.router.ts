import { IQueryParameters } from 'document-ts'
import { Request, Response, Router } from 'express'
import { ObjectId } from 'mongodb'

import { Role } from '../../models/enums'
import { User, UserCollection } from '../../models/user'
import { authenticate } from '../../services/auth.service'
import { createNewUser } from '../../services/user.service'

const router = Router()

router.get(
  '/',
  authenticate({ requiredRole: Role.Manager }),
  async (req: Request, res: Response) => {
    const query: Partial<IQueryParameters> = {
      filter: req.query.filter as string,
      limit: Number(req.query.limit),
      skip: Number(req.query.skip),
      sortKeyOrList: req.query.sortKey,
      projectionKeyOrList: ['email', 'role', '_id', 'name'],
    }

    const users = await UserCollection.findWithPagination<User>(query)
    res.send(users)
  }
)

router.post(
  '/',
  authenticate({ requiredRole: Role.Manager }),
  async (req: Request, res: Response) => {
    const userData = req.body as User
    const success = await createNewUser(userData)
    if (success instanceof User) {
      res.send(success)
    } else {
      res.status(400).send({ message: 'Failed to create user.' })
    }
  }
)

router.get(
  '/:userId',
  authenticate({
    requiredRole: Role.Manager,
    permitIfSelf: {
      idGetter: (req: Request) => req.body._id,
      requiredRoleCanOverride: true,
    },
  }),
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOne({ _id: new ObjectId(req.params.userId) })
    if (!user) {
      res.status(404).send({ message: 'User not found.' })
    } else {
      res.send(user)
    }
  }
)

router.put(
  '/:userId',
  authenticate({
    requiredRole: Role.Manager,
    permitIfSelf: {
      idGetter: (req: Request) => req.body._id,
      requiredRoleCanOverride: true,
    },
  }),
  async (req: Request, res: Response) => {
    const userData = req.body as User
    const { userId } = req.params
    delete userData._id
    await UserCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: userData }
    )

    const user = await UserCollection.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      res.status(404).send({ message: 'User not found.' })
    } else {
      res.send(user)
    }
  }
)

export { router }
