import { AuthResponse } from './../types/auth.type'
import http from 'src/utils/http'
import { EmailPasswordSchema } from 'src/utils/rules'
import path from 'src/constants/path'

export const registerAccount = (body: EmailPasswordSchema) => http.post<AuthResponse>(path.register, body)
export const login = (body: EmailPasswordSchema) => http.post<AuthResponse>(path.login, body)
export const logout = () => http.post<AuthResponse>(path.logout)
