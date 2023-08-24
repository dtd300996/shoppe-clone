import { screen, waitFor, fireEvent } from '@testing-library/react'
import path from 'src/constants/path'
import { logScreen, renderWithRoute } from 'src/utils/testUtils'
import { describe, it, expect } from 'vitest'
// import matchers from '@testing-library/jest-dom/matchers' // import wrong
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

describe('Login', () => {
  it('hien thi required khi khong nhap gi', async () => {
    const { user, container } = renderWithRoute({ route: path.login })

    await waitFor(() => {
      expect(screen.getByText(/Do not have an Account?/i)?.textContent).toMatch('Do not have an account')
      expect(document.querySelector('title')?.textContent).toBe('Login')

      expect(screen.queryByPlaceholderText(/Email/i)).toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/Password/i)).toBeInTheDocument()
    })

    // const submitButton = document.querySelector('form [type="submit"]') as HTMLElement
    const submitButton = container.querySelector('form [type="submit"]') as HTMLElement
    await user.click(submitButton)

    await waitFor(async () => {
      // expect(screen.getByText(/Email is required/i).textContent).toMatch(/Email is required/i)
      expect(screen.getByText(/Email is required/i)).toBeTruthy()
      expect(await screen.findByText(/Password is required/i)).toBeTruthy() // findByText return promise
    })
  })

  it('hien thi validate khi nhap sai', async () => {
    const { container } = renderWithRoute({ route: path.login })
    const form = container.querySelector('form') as HTMLFormElement

    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
    const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement

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
    fireEvent.change(passwordInput, {
      target: {
        value: '1111111'
      }
    })

    fireEvent.submit(form)

    await waitFor(async () => {
      expect(screen.getByText(/Email hoặc password không đúng/i)).toBeTruthy()
    })
  })

  it('login ok with page = /login', async () => {
    const { container } = renderWithRoute({ route: path.login })
    const form = container.querySelector('form') as HTMLFormElement

    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
    const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement

    // email & password invalid
    fireEvent.change(emailInput, { target: { value: 'dtd1@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: '111111' } })

    fireEvent.submit(form)

    await waitFor(async () => {
      expect(document.querySelector('title')?.textContent).toMatch(/products/i)
    })
    await logScreen()
  })

  it('login ok with page = /login?url=/user/profile', async () => {
    const { container } = renderWithRoute({ route: path.login + '?url=%2Fuser%2Fprofile' })
    const form = container.querySelector('form') as HTMLFormElement

    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
    const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement

    // email & password invalid
    fireEvent.change(emailInput, { target: { value: 'dtd1@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: '111111' } })

    fireEvent.submit(form)

    await waitFor(async () => {
      expect(document.querySelector('title')?.textContent).toMatch(/User/i)
    })
    // await logScreen()
  })
})
