import { AuthResponse } from './../types/auth.type'
import http from 'src/utils/http'
import { EmailPasswordSchema } from 'src/utils/rules'

export const registerAccount = (body: EmailPasswordSchema) => http.post<AuthResponse>('/register', body)
