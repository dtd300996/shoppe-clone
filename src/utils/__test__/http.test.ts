import { beforeEach, describe, it, expect } from 'vitest'
import { Http } from '../http'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { getAccessTokenFromLS, getRefreshTokenFromLS, setAccessTokenToLS, setRefreshTokenToLS } from '../auth'

describe('http axios', () => {
  let http = new Http().instance

  beforeEach(() => {
    // trc khi it chay => clear
    localStorage.clear()
    localStorage.setItem('testing', 'true')
    http = new Http().instance
  })

  it('Call api', async () => {
    // khong nen dung den folder api, file .api
    // vi test rieng file http chi nen dung http thoi
    // vi folder api co thay doi thi khong anh huong test code http nay
    const res = await http.get('products')
    // console.log({ res })

    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Call api error status !== 422 & 401', async () => {
    const error = await http.get('wrong-url').catch((error) => error)
    expect(error instanceof Error).toBe(true)
  })

  it('Auth request', async () => {
    // nen co 1 account test + 1 server test rieng
    await http.post('login', {
      email: 'dtd1@gmail.com',
      password: '111111'
    })

    const res = await http.get('me')

    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Refresh token', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await http
      .post(
        'login',
        {
          email: 'dtd1@gmail.com',
          password: '111111'
        },
        {
          headers: {
            'expire-access-token': 0,
            'expire-refresh-token': 1000
          }
        }
      )
      .then((r) => r.data)
    await http.get('products') // delay de access_token expire
    const res = await http.get('me')
    // console.log({ res: res.config.headers.Authorization })
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Refresh token expire', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await http
      .post(
        'login',
        {
          email: 'dtd1@gmail.com',
          password: '111111'
        },
        {
          headers: {
            'expire-access-token': 0,
            'expire-refresh-token': 0
          }
        }
      )
      .then((r) => r.data)
    await http.get('products') // delay de access_token expire
    const res = await http.get('me').catch((error) => error)
    expect(res instanceof Error).toBe(true)
  })

  it('Logout', async () => {
    await http.post('login', {
      email: 'dtd1@gmail.com',
      password: '111111'
    })
    await http.post('logout')
    expect(getAccessTokenFromLS()).toBe('')
    expect(getRefreshTokenFromLS()).toBe('')
  })
})
