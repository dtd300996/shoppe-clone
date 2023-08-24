/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from '@testing-library/react'
import path from 'src/constants/path'
import { delay, renderWithRouter } from 'src/utils/testUtils'
import { beforeAll, describe, expect, it } from 'vitest'
// import matchers from '@testing-library/jest-dom/matchers' // import wrong
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

describe('Login', () => {
  let user: any

  let form: HTMLFormElement
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement

  beforeAll(async () => {
    const dataRender = renderWithRouter({ route: path.login })
    user = dataRender.user

    // wait => neu khong wait thi document.querySelector('...') = null
    await delay(1000)

    form = document.querySelector('form') as HTMLFormElement
    emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
    passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
  })

  it('hien thi required khi khong nhap gi', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Do not have an Account?/i)?.textContent).toMatch('Do not have an account')
      expect(document.querySelector('title')?.textContent).toBe('Login')

      expect(screen.queryByPlaceholderText(/Email/i)).toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/Password/i)).toBeInTheDocument()
    })

    // const submitButton1 = document.querySelector('form [type="submit"]') as HTMLElement
    await user.click(submitButton)
    await waitFor(async () => {
      expect(screen.queryByText('Email is required')).toBeTruthy()
      expect(screen.getByText(/Email is required/i)).toBeTruthy()
      expect(await screen.findByText(/Password is required/i)).toBeTruthy() // findByText return promise
    })
  })

  it('hien thi validate khi nhap sai', async () => {
    // email & password invalid
    fireEvent.change(emailInput, { target: { value: 'dtd1@gma' } })
    fireEvent.change(passwordInput, { target: { value: '11' } })

    fireEvent.submit(form)

    await waitFor(async () => {
      expect(screen.getByText(/Email invalidate/i)).toBeTruthy()
      expect(screen.getByText(/Length from 6 to 160 characters/i)).toBeTruthy()
    })

    // email ok & password invalid
    fireEvent.change(emailInput, { target: { value: 'dtd1@gmail.com' } })
    fireEvent.change(passwordInput, {
      target: {
        value:
          '11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
      }
    })

    fireEvent.submit(form)

    await waitFor(async () => {
      expect(screen.getByText(/Length from 6 to 160 characters/i)).toBeTruthy()
    })

    // email ok & password wrong
    // fireEvent.change(passwordInput, {
    //   target: {
    //     value: '1111111'
    //   }
    // })

    // fireEvent.submit(form)

    // await waitFor(async () => {
    //   expect(screen.getByText(/Email hoặc password không đúng/i)).toBeTruthy()
    // })
  })

  it('login ok', async () => {
    // email & password invalid
    fireEvent.change(emailInput, { target: { value: 'dtd1@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: '111111' } })

    fireEvent.click(submitButton)

    // Những trường hợp chứng minh rằng tìm không ra text hay là element
    // Thì nên dùng query hơn là find hay get
    await waitFor(() => {
      expect(screen.queryByText('Email invalidate')).toBeFalsy()
      expect(screen.queryByText(/Length from 6 to 160 characters/i)).toBeFalsy()
    })
    // fireEvent.submit(form)

    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toMatch(/products/i)
    })
  })
})
