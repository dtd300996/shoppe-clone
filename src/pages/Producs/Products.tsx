import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import categoryApi from 'src/api/category.api'
import productApi from 'src/api/product.api'
import Pagination from 'src/components/Pagination'
import path from 'src/constants/path'
import useQueryParams from 'src/hooks/useQueryParams'
import { ProductsConfig } from 'src/types/product.type'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product/Product'
import SortProducts from './components/SortProducts'

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
      price_min: queryParams.price_min,
      price_max: queryParams.price_max,
      name: queryParams.name,
      category: queryParams.category
    },
    isUndefined
  )

  const { data: products } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productApi.getProducts(queryConfig as ProductsConfig),
    keepPreviousData: true
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {products && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} pathname={path.home} categories={categories?.data.data || []} />
            </div>
            <div className='col-span-9 '>
              <SortProducts
                queryConfig={queryConfig}
                pageSize={products?.data.data.pagination.page_size}
                pathname={path.home}
              />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {products.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination<QueryConfig>
                pageSize={products.data.data.pagination.page_size}
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
