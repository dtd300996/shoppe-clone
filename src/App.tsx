import useRouteElements from './hooks/useRouteElements'
import router from './router'

function App() {
  const routerElements = useRouteElements(router)
  return <div>{routerElements}</div>
}

export default App
