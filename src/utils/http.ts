import axios, { AxiosError, AxiosInstance } from 'axios'
import { ResponseApi } from './../types/utils.type'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from './utils'
// import HttpStatusCode from 'src/constants/httpStatusCode.enum'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.response.use(
      function (res) {
        return res
      },
      function (error: AxiosError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = error.response?.data

        if (!isAxiosUnprocessableEntityError<ResponseApi<AxiosError>>(error)) {
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
