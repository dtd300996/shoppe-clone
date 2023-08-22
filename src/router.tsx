
import ResisterLayout from './Layout/ResisterLayout'
import MainLayout from './Layout/MainLayout'
import { Navigate, Outlet, RouteObject } from 'react-router-dom'
import { Suspense, lazy, useContext } from 'react'
import { AppContext } from './contexts/app.context'
import path from './constants/path'
import CartLayout from './Layout/CartLayout'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
// import Login from './pages/Login'
// import Products from './pages/Producs'
// import Register from './pages/Resister'
// import UserLayout from './pages/User/layout/UserLayout'
// import Profile from './pages/User/Pages/Profile'
// import ChangePasswork from './pages/User/Pages/ChangePassword'
// import HistoryPurchase from './pages/User/Pages/HistoryPurchase'

const Login = lazy(() => import('./pages/Login'))
const Products = lazy(() => import('./pages/Producs'))
const Register = lazy(() => import('./pages/Resister'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const UserLayout = lazy(() => import('./pages/User/layout/UserLayout'))
const Profile = lazy(() => import('./pages/User/Pages/Profile'))
const ChangePasswork = lazy(() => import('./pages/User/Pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/Pages/HistoryPurchase'))

const NotFound = lazy(() => import('./pages/NotFound'))

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
        <Suspense fallback={<>Loading...</>}>
          <Products />
        </Suspense>
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
            <Suspense>
              <Cart />
            </Suspense>
          </CartLayout>
        )
      },
      {
        path: path.user,
        element: (
          <MainLayout>
            <Suspense>
              <UserLayout />
            </Suspense>
          </MainLayout>
        ),
        children: [
          {
            path: path.profile,
            element: (
              <Suspense>
                <Profile />
              </Suspense>
            )
          },
          {
            path: path.changePassword,
            element: (
              <Suspense>
                <ChangePasswork />
              </Suspense>
            )
          },
          {
            path: path.historyPurchase,
            element: (
              <Suspense>
                <HistoryPurchase />
              </Suspense>
            )
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
        <Suspense>
          <ProductDetail />
        </Suspense>
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
            <Suspense>
              <Login />
            </Suspense>
          </ResisterLayout>
        )
      },
      {
        path: path.register,
        element: (
          <ResisterLayout>
            <Suspense>
              <Register />
            </Suspense>
          </ResisterLayout>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <Suspense>
        <NotFound />
      </Suspense>
    )
  }
]

export default router
