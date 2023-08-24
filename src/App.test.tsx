import { screen, waitFor } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import path from './constants/path'
import { renderWithRouter } from './utils/testUtils'

describe('App', async () => {
  test('App render and redirect page', async () => {
    // app use client de render (browser) => use render de render khi test (nodejs)
    // render(<App />, { wrapper: BrowserRouter })
    // const user = userEvent.setup()

    const { user } = renderWithRouter()

    /**
     * waitFor se run callback 1 vai lan hoac expect pass
     * cho den khi het timeout
     * so lan run phu thuoc vao timeout va interval
     * default: timeout = 1000ms & interval = 50ms
     * */

    // verify vao home page (products)
    await waitFor(
      () => {
        expect(document.querySelector('title')?.textContent).toBe('Products')
      },
      { timeout: 2000 }
    )

    // verify redirect to login page
    await user.click(screen.getByText(/Login/i))
    await waitFor(
      () => {
        expect(screen.getByText(/Do not have an Account?/i)?.textContent).toMatch('Do not have an account')
        expect(document.querySelector('title')?.textContent).toBe('Login')
      },
      { timeout: 2000 }
    )
  })

  test('`Redirect` to Not found page', async () => {
    const badRoute = '/some/bad/route'
    // render(
    //   <MemoryRouter initialEntries={[badRoute]}>
    //     <App />
    //   </MemoryRouter>
    // )

    renderWithRouter({ route: badRoute })

    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('404 Not Found')
      expect(screen.getByText(/Page Not Found/).textContent).toMatch('Page Not Found')
      expect(screen.getByText(/404/).textContent).toMatch('404')
    })
  })

  test('Render register page', async () => {
    const route = path.register
    renderWithRouter({ route })

    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toMatch(/register/i)
      expect(screen.getByText(/Do you already have an account?/).textContent).toMatch('Do you already have an account?')
    })
  })
})
