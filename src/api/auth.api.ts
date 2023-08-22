import { AuthResponse } from './../types/auth.type'
import http from 'src/utils/http'
import { EmailPasswordSchema } from 'src/utils/rules'

export const URL_LOGIN = 'login'
export const URL_LOGOUT = 'logout'
export const URL_REGISTER = 'register'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

export const registerAccount = (body: EmailPasswordSchema) => http.post<AuthResponse>(URL_REGISTER, body)
export const login = (body: EmailPasswordSchema) => http.post<AuthResponse>(URL_LOGIN, body)
export const logout = () => http.post<AuthResponse>(URL_LOGOUT)
