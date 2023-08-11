import Login from './pages/Login'
import Products from './pages/Producs'
import Register from './pages/Resister'
import ResisterLayout from './Layout/ResisterLayout'
import MainLayout from './Layout/MainLayout'
import { Navigate, Outlet, RouteObject } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import path from './constants/path'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import CartLayout from './Layout/CartLayout'
import UserLayout from './pages/User/layout/UserLayout'
import Profile from './pages/User/Pages/Profile'
import ChangePasswork from './pages/User/Pages/ChangePassword'
import HistoryPurchase from './pages/User/Pages/HistoryPurchase'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  const url = encodeURIComponent(location.pathname)
  return isAuthenticated ? <Outlet /> : <Navigate to={`/login?url=${url}`} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Navigate to='/' /> : <Outlet />
}

const router: RouteObject[] = [
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
      // {
      //   path: path.profile,
      //   element: (
      //     <MainLayout>
      //       <UserLayout>
      //         <Profile />
      //       </UserLayout>
      //     </MainLayout>
      //   )
      // }
      {
        path: path.cart,
        element: (
          <CartLayout>
            <Cart />
          </CartLayout>
        )
      },
      {
        path: path.user,
        element: (
          <MainLayout>
            <UserLayout />
          </MainLayout>
        ),
        children: [
          {
            path: path.profile,
            element: <Profile />
          },
          {
            path: path.changePassword,
            element: <ChangePasswork />
          },
          {
            path: path.historyPurchase,
            element: <HistoryPurchase />
          }
        ]
      }
    ]
  },
  {
    path: path.productDetail,
    index: true,
    element: (
      <MainLayout>
        <ProductDetail />
      </MainLayout>
    )
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
