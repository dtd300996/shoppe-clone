import { useRoutes, RouteObject } from 'react-router'

export default function useRouteElements(router: RouteObject[]) {
  const routeElements = useRoutes(router)

  return routeElements
}
