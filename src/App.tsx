import { useContext, useEffect } from 'react'
import useRouteElements from './hooks/useRouteElements'
import { LSEventTarget } from './utils/auth'
import { HelmetProvider } from 'react-helmet-async'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppProvider, AppContext } from './contexts/app.context'
import ErrorBoundary from './components/ErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

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
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AppProvider>
          <ErrorBoundary>{routerElements}</ErrorBoundary>
        </AppProvider>
      </HelmetProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
    </QueryClientProvider>
  )
}

export default App
