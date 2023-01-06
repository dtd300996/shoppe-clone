import Login from './pages/Login'
import Products from './pages/Producs'
import Register from './pages/Resister'
import ResisterLayout from './Layout/ResisterLayout'
import MainLayout from './Layout/MainLayout'
import { Navigate, Outlet } from 'react-router-dom'
import Profile from './pages/Profile'

export interface RouterElementType {
  path: string
  element: JSX.Element
  children?: RouterElementType[]
  index?: boolean
}
const isAuthenticated = false

function ProtectedRoute() {
  const url = location.href
  return isAuthenticated ? <Outlet /> : <Navigate to={`/login?url=${url}`} />
}

function RejectedRoute() {
  return isAuthenticated ? <Navigate to='/' /> : <Outlet />
}

const router: RouterElementType[] = [
  {
    path: '',
    index: true,
    element: (
      <MainLayout>
        <Products />
      </MainLayout>
    )
  },
  {
    path: '',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'profile',
        element: (
          <MainLayout>
            <Profile />
          </MainLayout>
        )
      }
    ]
  },
  {
    path: '',
    element: <RejectedRoute />,
    children: [
      {
        path: 'login',
        element: (
          <ResisterLayout>
            <Login />
          </ResisterLayout>
        )
      },
      {
        path: 'register',
        element: (
          <ResisterLayout>
            <Register />
          </ResisterLayout>
        )
      }
    ]
  }
]

export default router
