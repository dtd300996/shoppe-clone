import { useRoutes } from 'react-router'
import { RouterElementType } from 'src/router'

export default function useRouteElements(router: RouterElementType[]) {
  const routeElements = useRoutes(router)

  return routeElements
}
