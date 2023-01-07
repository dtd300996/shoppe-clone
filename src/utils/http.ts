import { AuthResponse } from './../types/auth.type'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { ErrorResponse } from './../types/utils.type'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from './utils'
import { clearAccessTokenFromLS, getAccessTokenFromLS, saveAccessTokenToLS } from './auth'
// import HttpStatusCode from 'src/constants/httpStatusCode.enum'

class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
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
        if (url === '/login' || url === '/register') {
          this.accessToken = (res.data as AuthResponse)?.data.access_token
          saveAccessTokenToLS(this.accessToken)
        } else if (url === '/logout') {
          this.accessToken = ''
          clearAccessTokenFromLS()
        }

        return res
      },
      (error: AxiosError) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = error.response?.data

        if (!isAxiosUnprocessableEntityError<ErrorResponse<AxiosError>>(error)) {
          const msg = data.message || error.message || error.message
          toast.error(msg)
        }

        // if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
        //   const msg = data.message || error.message
        //   toast.error(msg)
        // }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
