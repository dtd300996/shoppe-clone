import { User } from './user.type'
import { ResponseApi } from './utils.type'

export type AuthResponse = ResponseApi<{
  access_token: string
  expires: string | number
  refresh_token?: string
  expires_refresh_token?: number
  user: User
}>

// const auth: AuthResponse = {
//   message: 'Đăng nhập thành công',
//   data: {
//     access_token: 'access_token'
//     expires: 604800,
//     refresh_token: 'refresh_token',
//     expires_refresh_token: 8640000,
//     user: {
//       _id: '63ad40f46d7c62034084f433',
//       roles: ['User'],
//       email: 'dtd1@gmail.com',
//       createdAt: '2022-12-29T07:25:40.193Z',
//       updatedAt: '2022-12-29T07:25:40.193Z',
//       __v: 0
//     }
//   }
// }
