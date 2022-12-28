import { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'
type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email invalidate'
    },
    minLength: {
      value: 0,
      message: 'Length from 5 to 160 characters'
    },
    maxLength: {
      value: 160,
      message: 'Length from 5 to 160 characters'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password is required'
    },
    minLength: {
      value: 0,
      message: 'Length from 5 to 160 characters'
    },
    maxLength: {
      value: 160,
      message: 'Length from 5 to 160 characters'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirm password is required'
    },
    minLength: {
      value: 0,
      message: 'Length from 5 to 160 characters'
    },
    maxLength: {
      value: 160,
      message: 'Length from 5 to 160 characters'
    },
    validate:
      typeof getValues === 'function'
        ? (value: string | undefined) => {
            const password = getValues('password')
            return password?.trim() === value?.trim() || 'Confirm password does not match password'
          }
        : undefined
  }
})

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email invalidate')
    .min(5, 'Length from 5 to 160 characters')
    .max(160, 'Length from 5 to 160 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Length from 5 to 160 characters')
    .max(160, 'Length from 5 to 160 characters'),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .min(5, 'Length from 5 to 160 characters')
    .max(160, 'Length from 5 to 160 characters')
    .oneOf([yup.ref('password')], 'Confirm password does not match password')
})
export type Schema = yup.InferType<typeof schema>

export const loginSchema = schema.omit(['confirm_password'])
export type LoginSchema = yup.InferType<typeof loginSchema>
