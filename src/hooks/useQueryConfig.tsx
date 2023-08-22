// lodash khong co tinh nang tree shaking
// import { isUndefined, omitBy } from 'lodash'
// import truc tiep (optimize)
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { ProductsConfig } from 'src/types/product.type'
import useQueryParams from './useQueryParams'

export type QueryConfig = {
  [key in keyof ProductsConfig]: string
}

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      order: queryParams.order,
      rating_filter: queryParams.rating_filter,
      price_min: queryParams.price_min,
      price_max: queryParams.price_max,
      name: queryParams.name,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}
