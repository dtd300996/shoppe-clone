import useRouteElements from './hooks/useRouteElements'
import router from './router'

function App() {
  const routerElements = useRouteElements(router)
  return <>{routerElements}</>
}

export default App
