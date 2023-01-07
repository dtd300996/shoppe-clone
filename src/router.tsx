import Login from './pages/Login'
import Products from './pages/Producs'
import Register from './pages/Resister'
import ResisterLayout from './Layout/ResisterLayout'
import MainLayout from './Layout/MainLayout'
import { Navigate, Outlet } from 'react-router-dom'
import Profile from './pages/Profile'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import path from './constants/path'
export interface RouterElementType {
  path: string
  element: JSX.Element
  children?: RouterElementType[]
  index?: boolean
}

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  const url = encodeURIComponent(location.href)
  return isAuthenticated ? <Outlet /> : <Navigate to={`/login?url=${url}`} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Navigate to='/' /> : <Outlet />
}

const router: RouterElementType[] = [
  {
    path: path.home,
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
        path: path.profile,
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
        path: path.login,
        element: (
          <ResisterLayout>
            <Login />
          </ResisterLayout>
        )
      },
      {
        path: path.register,
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
