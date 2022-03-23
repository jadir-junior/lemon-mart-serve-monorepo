import { PhoneType, Role } from '../models/enums'
import { IUser, User, UserCollection } from '../models/user'

export async function initializeDemoUser(email: string, password: string, id: string) {
  // This function loads a demo user.
  // In a production application you would seed admin users in a similiar way (except for the user id);

  const existingUser = await UserCollection.findOne({ email })

  if (existingUser) {
    console.log('Found existing user... deleting')
    await existingUser.delete()
  }

  const defaultUser = new User({
    email,
    name: { first: 'Jadir', last: 'Junior' },
    picture: 'https://avatars.githubusercontent.com/u/8190617?v=4',
    role: Role.Manager,
    dateOfBirth: new Date(1989, 6, 27),
    userStatus: true,
    level: 2,
    address: {
      line1: 'Rua Santa Isabel',
      city: 'São Paulo',
      state: 'São Paulo',
      zip: '01221010',
    },
    phones: [
      {
        type: PhoneType.Mobile,
        digits: '5511999609710',
      },
    ],
  })

  await defaultUser.create(id, password, true)
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
