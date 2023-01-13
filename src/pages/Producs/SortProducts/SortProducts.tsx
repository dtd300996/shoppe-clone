import classNames from 'classnames'
import { omit } from 'lodash'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeftSvg, ChevronRightSvg } from 'src/assets/icons'
import { SORT_BY, ORDER } from 'src/constants/product'
import { ProductsConfig } from 'src/types/product.type'
import { QueryConfig } from '../Products'
type Props = {
  pageSize: number
  queryConfig: QueryConfig
  pathname: string
}

export default function SortProducts({ queryConfig, pageSize, pathname }: Props) {
  const navigate = useNavigate()
  const currentPage = Number(queryConfig.page)
  const { sort_by = SORT_BY.createdAt, order = '' } = queryConfig

  const isActiveSortBy = (sortByValue: Exclude<ProductsConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductsConfig['sort_by'], undefined>) => () => {
    navigate({
      pathname,
      search: createSearchParams(omit({ ...queryConfig, sort_by: sortByValue }, ['order'])).toString()
    })
  }

  const handleSortPriceOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    navigate({
      pathname,
      search: createSearchParams({ ...queryConfig, order: value, sort_by: SORT_BY.price }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Filter by</div>
          <button
            className={classNames('h-8 bg-white px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(SORT_BY.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(SORT_BY.view)
            })}
            onClick={handleSort(SORT_BY.view)}
          >
            Popular
          </button>
          <button
            className={classNames('h-8 bg-white px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(SORT_BY.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(SORT_BY.createdAt)
            })}
            onClick={handleSort(SORT_BY.createdAt)}
          >
            New
          </button>
          <button
            className={classNames('h-8 bg-white px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(SORT_BY.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(SORT_BY.sold)
            })}
            onClick={handleSort(SORT_BY.sold)}
          >
            Best selling
          </button>
          <select
            className={classNames('h-8 bg-white px-4 text-center text-sm capitalize outline-none', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(SORT_BY.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(SORT_BY.price)
            })}
            value={order}
            onChange={handleSortPriceOrder}
          >
            <option value={''} disabled className='bg-white text-black'>
              Price
            </option>
            <option value={ORDER.asc} className='bg-white text-black'>
              Price: Low to high
            </option>
            <option value={ORDER.desc} className='bg-white text-black'>
              Price: High to low
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{currentPage}</span>
            <span className=''>/{pageSize}</span>
          </div>
          <div className='ml-2 flex shadow-sm'>
            {currentPage === 1 ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60 shadow hover:bg-slate-100'>
                <ChevronLeftSvg className='h-3 w-3' />
              </span>
            ) : (
              <Link
                to={{
                  pathname,
                  search: createSearchParams({ ...queryConfig, page: (currentPage - 1).toString() }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm bg-white  shadow hover:bg-slate-100'
              >
                <ChevronLeftSvg className='h-3 w-3' />
              </Link>
            )}

            {currentPage === pageSize ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60 shadow hover:bg-slate-100'>
                <ChevronRightSvg className='h-3 w-3' />
              </span>
            ) : (
              <Link
                to={{
                  pathname,
                  search: createSearchParams({ ...queryConfig, page: (currentPage + 1).toString() }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm bg-white  shadow hover:bg-slate-100'
              >
                <ChevronRightSvg className='h-3 w-3' />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
