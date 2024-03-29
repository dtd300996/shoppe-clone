import axios, { AxiosError } from 'axios'
import config from 'src/constants/config'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import userImage from 'src/assets/images/user.svg'
import { ErrorResponse } from 'src/types/utils.type'

const SEPERATOR_Id = '-i-'

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

// UnprocessableEntity: 422
export const isAxiosUnprocessableEntityError = <FormError>(error: unknown): error is AxiosError<FormError> => {
  // eslint-disable-next-line import/no-named-as-default-member
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export const isAxiosUnauthorizedError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  // eslint-disable-next-line import/no-named-as-default-member
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export const isAxiosExpiredTokenError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  // eslint-disable-next-line import/no-named-as-default-member
  return (
    isAxiosUnauthorizedError<
      ErrorResponse<{
        name: string
        message: string
      }>
    >(error) && error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}

export const formatCurrency = (currency: number) => new Intl.NumberFormat('de-DE').format(currency)

export const formatNumberToSocialStyle = (value: number, seperator?: string) => {
  const format = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)

  return seperator ? format.replace('.', seperator) : format
}

export const rateSale = (original: number, sale: number) => Math.round(((original - sale) / original) * 100) + '%'

export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `${SEPERATOR_Id}${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split(`${SEPERATOR_Id}`)
  return arr[arr.length - 1]
}

export const getAvatarUrl = (avatarName?: string) => (avatarName ? `${config.baseUrl}images/${avatarName}` : userImage)
