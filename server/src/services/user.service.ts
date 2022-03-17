import * as jwt from 'jsonwebtoken'

import { config } from '../config'
import { IUser, User } from '../models/user'

export function createJwt(user: IUser): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const payload = {
      email: user.email,
      role: user.role,
      picture: user.picture,
    }

    jwt.sign(
      payload,
      config.JwtSecret(),
      { subject: user._id.toHexString(), expiresIn: 'id' },
      (err: Error | null, encoded: string | undefined): void => {
        if (err) {
          reject(err.message)
        }
        resolve(encoded!)
      }
    )
  })
}

export async function createNewUser(userData: IUser): Promise<User | boolean> {
  const user = new User(userData)
  const success = await user.save()
  if (success) {
    return user
  } else {
    return false
  }
}
