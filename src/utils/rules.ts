import { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import { NoUndefinedField } from 'src/types/utils.type'
import * as yup from 'yup'
import { AnyObject } from 'yup/lib/types'

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

function testPriceMinMax(this: yup.TestContext<AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

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
    .oneOf([yup.ref('password')], 'Confirm password does not match password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Invalid price',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Invalid price',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('Name product is require')
})
export type Schema = yup.InferType<typeof schema>

// export const emailPasswordSchema = schema.omit(['confirm_password']) // not suitable because of schema bloat
export const emailPasswordSchema = schema.pick(['email', 'password'])
export type EmailPasswordSchema = yup.InferType<typeof emailPasswordSchema>

export const priceSchema = schema.pick(['price_min', 'price_max'])
export type PriceSchema = NoUndefinedField<Pick<Schema, 'price_min' | 'price_max'>>
