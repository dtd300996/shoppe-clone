import Login from './pages/Login'
import Products from './pages/Producs'
import Register from './pages/Resister'
import ResisterLayout from './Layout/ResisterLayout'

export interface RouterElementType {
  path: string
  element: JSX.Element
  children?: RouterElementType[]
}

const router: RouterElementType[] = [
  {
    path: '/',
    element: <Products />
  },
  {
    path: '/login',
    element: (
      <ResisterLayout>
        <Login />
      </ResisterLayout>
    )
  },
  {
    path: '/register',
    element: (
      <ResisterLayout>
        <Register />
      </ResisterLayout>
    )
  }
]

export default router
