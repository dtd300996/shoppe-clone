import { useContext, useEffect } from 'react'
import useRouteElements from './hooks/useRouteElements'
import router from './router'
import { LSEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'

function App() {
  const routerElements = useRouteElements(router)
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LSEventTarget.addEventListener('clearLSEvent', reset)

    return () => {
      LSEventTarget.removeEventListener('clearLSEvent', reset)
    }
  }, [reset])

  return <>{routerElements}</>
}

export default App
