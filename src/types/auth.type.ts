import { User } from './user.type'
import { ResponseApi } from './utils.type'

export type AuthResponse = ResponseApi<{
  assess_token: string
  expires: string
  user: User
}>

// const auth: AuthResponse = {
//   message: 'string',
//   data: {
//     assess_token: 'string',
//     expires: 'string',
//     user: {
//       _id: 'string',
//       roles: ['Admin'],
//       address: 'string',
//       __v: 1,
//       createdAt: '12 12 12',
//       updatedAt: '12 12 13',
//       date_of_birth: null,
//       email: 'dtd1@gmail.com',
//       name: 'string',
//       phone: '0999999999'
//     }
//   }
// }
