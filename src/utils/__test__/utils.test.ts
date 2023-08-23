/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { isAxiosError, isAxiosUnprocessableEntityError } from '../utils'
import { AxiosError } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

// describe dung de mo ta tap hop cac ngu canh
// hoac 1 don vi can test. VD: function, component
describe('isAxiosError', () => {
  // it dung de ghi chu case can test
  it('isAxiosError return boolean', () => {
    // expect dung de mong doi value tra ve
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosUnprocessableEntityError', () => {
  // it dung de ghi chu case can test
  it('isAxiosUnprocessableEntityError return boolean', () => {
    // expect dung de mong doi value tra ve
    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, null, {
          status: HttpStatusCode.InternalServerError,
          data: null
        } as any)
      )
    ).toBe(false)

    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, null, {
          status: HttpStatusCode.UnprocessableEntity,
          data: null
        } as any)
      )
    ).toBe(true)
  })
})
