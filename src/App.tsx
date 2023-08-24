import { useContext, useEffect } from 'react'
import useRouteElements from './hooks/useRouteElements'
import { LSEventTarget } from './utils/auth'
import { HelmetProvider } from 'react-helmet-async'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './contexts/app.context'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const routerElements = useRouteElements()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LSEventTarget.addEventListener('clearLSEvent', reset)

    return () => {
      LSEventTarget.removeEventListener('clearLSEvent', reset)
    }
  }, [reset])

  return (
    <HelmetProvider>
      <ErrorBoundary>{routerElements}</ErrorBoundary>
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </HelmetProvider>
  )
}

export default App
