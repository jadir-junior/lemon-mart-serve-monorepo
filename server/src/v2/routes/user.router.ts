import { IQueryParameters } from 'document-ts'
import { Request, Response, Router } from 'express'
import { ObjectId } from 'mongodb'

import { Role } from '../../models/enums'
import { User, UserCollection } from '../../models/user'
import { authenticate } from '../../services/auth.service'
import { createNewUser } from '../../services/user.service'

const router = Router()

/**
 * @swagger
 * /v2/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Searches, sorts, paginates and returns a summary of `User` objects.
 *     parameters:
 *       - $ref: '#/components/parameters/filterParam'
 *       - $ref: '#/components/parameters/skipParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortKeyParam'
 *     responses:
 *       "200": # Response
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fullName:
 *                         type: string
 *                       name:
 *                         $ref: "#/components/schemas/Name"
 *                       role:
 *                         $ref: "#/components/schemas/Role"
 *                     description: Summary of `User` object.
 */
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

/**
 * @swagger
 * /v2/users:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new `User`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *        '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
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

/**
 * @swagger
 * /v2/users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Gets a `User` object by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User's unique id
 *     responses:
 *        '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
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

/**
 * @swagger
 * /v2/users/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates an existing `User`
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User's unique id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *        '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
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
