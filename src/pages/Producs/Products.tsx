import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import productApi from 'src/api/product.api'
import Pagination from 'src/components/Pagination'
import path from 'src/constants/path'
import useQueryParams from 'src/hooks/useQueryParams'
import { ProductsConfig } from 'src/types/product.type'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProducts from './SortProducts'

export type QueryConfig = {
  [key in keyof ProductsConfig]: string
}

export default function Products() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      order: queryParams.order,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      name: queryParams.name
    },
    isUndefined
  )

  const { data } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productApi.getProducts(queryConfig as ProductsConfig),
    keepPreviousData: true
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {data && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter />
            </div>
            <div className='col-span-9 '>
              <SortProducts
                queryConfig={queryConfig}
                pageSize={data?.data.data.pagination.page_size}
                pathname={path.home}
              />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {data.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination<QueryConfig>
                pageSize={data.data.data.pagination.page_size}
                queryConfig={queryConfig}
                pathname={path.home}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
