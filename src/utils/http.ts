import { AuthResponse, RefreshTokenResponse } from './../types/auth.type'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { ErrorResponse } from './../types/utils.type'
import { toast } from 'react-toastify'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError, isAxiosUnprocessableEntityError } from './utils'
import {
  clearAuthFromLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth'
import path from 'src/constants/path'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import config from 'src/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/api/auth.api'
// import HttpStatusCode from 'src/constants/httpStatusCode.enum'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null

    this.instance = axios.create({
      // baseURL: 'https://api-ecom.duthanhduoc.com/',
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        // 'expire-access-token': 5,
        // 'expire-refresh-token': 20
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
          // config.headers = {
          //   ...config.headers,
          //   Authorization: this.accessToken
          // }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (res) => {
        const { url } = res.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = (res.data as AuthResponse)?.data
          this.accessToken = data.access_token
          this.refreshToken = data.refresh_token

          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileToLS(data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearAuthFromLS()
        }

        return res
      },
      (error: AxiosError) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = error.response?.data

        // chi toast err !== 422 + 401

        if (
          !isAxiosUnprocessableEntityError<ErrorResponse<AxiosError>>(error) &&
          !isAxiosUnauthorizedError<ErrorResponse<AxiosError>>(error)
        ) {
          const msg = data?.message || error?.message || 'System error'
          toast.error(msg)
        }

        // 401
        // 1. token wrong
        // 2. khong truyen token
        // 3. token expire

        if (isAxiosUnauthorizedError<ErrorResponse<AxiosError>>(error)) {
          const config = error.response?.config || {}
          const { url } = config
          // 3.
          // case token expire & request != refresh => call refresh token
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            if (url !== URL_REFRESH_TOKEN && isAxiosExpiredTokenError<ErrorResponse<AxiosError>>(error)) {
              // han che hoi 2 lan refresh (van co case goi 2 lan)
              this.refreshTokenRequest = this.refreshTokenRequest
                ? this.refreshTokenRequest
                : this.handleRefreshToken().finally(() => {
                    // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                    setTimeout(() => {
                      this.refreshTokenRequest = null
                    }, 10000)
                  })

              return this.refreshTokenRequest.then((access_token) => {
                // tiep tuc goi lai request cu vua bi 401
                return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
              })
            }

            // 1. 2.
            clearAuthFromLS()
            this.accessToken = ''
            this.refreshToken = ''
            toast.error(error.response?.data.data?.message || error.response?.data.message)
          }

          if (error.response?.status === HttpStatusCode.Unauthorized) {
            clearAuthFromLS()
          }

          // if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          //   const msg = data.message || error.message
          //   toast.error(msg)
          // }
          return Promise.reject(error)
        }
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        this.accessToken = access_token
        setAccessTokenToLS(access_token)

        return access_token
      })
      .catch((error) => {
        this.accessToken = ''
        this.refreshToken = ''
        clearAuthFromLS()
        throw error
      })
  }
}

const http = new Http().instance
export default http
