import * as bcrypt from 'bcryptjs'
import { CollectionFactory, Document, IDocument } from 'document-ts'
import { AggregationCursor, ObjectId } from 'mongodb'
import { v4 as uuid } from 'uuid'

import { Role } from './enums'
import { IPhone, Phone } from './phone'

export interface IName {
  first: string
  middle?: string
  last: string
}

export interface IUser extends IDocument {
  email: string
  name: IName
  picture: string
  role: Role
  userStatus: boolean
  dateOfBirth: Date
  level: number
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
  }
  phones?: IPhone[]
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Name:
 *       type: object
 *       properties:
 *         first:
 *           type: string
 *         middle:
 *           type: string
 *         last:
 *           type: string
 *       required:
 *         - first
 *         - last
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           $ref: "#/components/schemas/Name"
 *         picture:
 *           type: string
 *         role:
 *           $ref: "#/components/schemas/Role"
 *         userStatus:
 *           type: boolean
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         level:
 *           type: number
 *         address:
 *           type: object
 *           properties:
 *             line1:
 *               type: string
 *             line2:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zip:
 *               type: string
 *           required:
 *             - line1
 *             - city
 *             - state
 *             - zip
 *         phones:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Phone"
 *       required:
 *         - email
 *         - name
 *         - role
 *         - userStatus
 */
export class User extends Document<IUser> implements IUser {
  static collectionName = 'users'
  private password: string | undefined
  public email!: string
  public name!: IName
  public picture!: string
  public role!: Role
  public dateOfBirth!: Date
  public userStatus!: boolean
  public level!: number
  public address!: {
    line1: string
    city: string
    state: string
    zip: string
  }

  public phones?: IPhone[]

  constructor(user?: Partial<IUser>) {
    super(User.collectionName, user)
  }

  fillData(data?: Partial<IUser>) {
    if (data) {
      Object.assign(this, data)
    }

    if (this.phones) {
      this.phones = this.hydrateInterfaceArray(Phone, Phone.Build, this.phones)
    }
  }

  protected getCalculatedPropertiesToInclude(): string[] {
    return ['fullName']
  }

  protected getPropertiesToExclude(): string[] {
    return ['password']
  }

  public get fullName(): string {
    if (this.name.middle) {
      return `${this.name.first} ${this.name.middle} ${this.name.last}`
    }

    return `${this.name.first} ${this.name.last}`
  }

  async create(id?: string, password?: string, upsert = false) {
    if (id) {
      this._id = new ObjectId(id)
    }

    if (!password) {
      password = uuid()
    }

    this.password = await this.setPassword(password)
    await this.save({ upsert })
  }

  private setPassword(newPassword: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return reject(err)
        }
        bcrypt.hash(newPassword, salt, (hashError, hash) => {
          if (hashError) {
            return reject(hashError)
          }
          resolve(hash)
        })
      })
    })
  }

  comparePassword(password: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this
    return new Promise((resolve, reject) => {
      if (user?.password) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return reject(err)
          }
          resolve(isMatch)
        })
      }
    })
  }

  hasSameId(id: ObjectId): boolean {
    return this._id.toHexString() === id.toHexString()
  }
}

class UserCollectionFactory extends CollectionFactory<User> {
  constructor(docType: typeof User) {
    super(User.collectionName, docType, ['name.first', 'name.last', 'email'])
  }

  async createIndexes() {
    await this.collection().createIndexes([
      {
        key: {
          email: 1,
        },
        unique: true,
      },
      {
        key: {
          'name.first': 'text',
          'name.last': 'text',
          email: 'text',
        },
        weights: {
          'name.last': 4,
          'name.first': 2,
          email: 1,
        },
        name: 'TextIndex',
      },
    ])
  }

  userSearchQuery(
    searchText: string
  ): AggregationCursor<{ _id: ObjectId; email: string }> {
    const aggregateQuery = [
      {
        $match: {
          $text: { $search: searchText },
        },
      },
      {
        $project: {
          email: 1,
        },
      },
    ]

    if (searchText === undefined || searchText === '') {
      delete (aggregateQuery[0] as any).$match.$text
    }

    return this.collection().aggregate(aggregateQuery)
  }
}

export const UserCollection = new UserCollectionFactory(User)
