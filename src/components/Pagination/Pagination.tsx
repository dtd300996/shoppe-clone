import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'

/**
RANGE = 2 apply for range head, last and around currentPage_page
[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20
1 2 ...13 14 [15] 16 17 ... 19 20

1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

type Props<Q> = {
  pageSize: number
  queryConfig: Q & {
    page?: number | string
  }
  pathname: string
}

const RANGE = 2

export default function Pagination<T>({ queryConfig, pageSize, pathname }: Props<T>) {
  const currentPage = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true

        return (
          <span key={index} className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true

        return (
          <span key={index} className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
    }

    return Array(pageSize)
      .fill(1)
      .map((_, index) => {
        const pageNumber = index + 1
        // condition return [...]
        if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < pageSize - RANGE + 1) {
          // 1 2 3 4 [5] 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
          // check [...] after
          return renderDotAfter(index)
        } else if (currentPage > RANGE * 2 + 1 && currentPage < pageSize - RANGE * 2) {
          // after + before
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > currentPage + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (currentPage >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
          // before
          return renderDotBefore(index)
        }

        return (
          <Link
            to={{
              pathname,
              search: createSearchParams({ ...queryConfig, page: pageNumber.toString() }).toString()
            }}
            key={index}
            className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
              'border-cyan-500': pageNumber == currentPage,
              'border-transparent': pageNumber != currentPage
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {currentPage === 1 ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2 shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname,
            search: createSearchParams({ ...queryConfig, page: (currentPage - 1).toString() }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
        >
          Prev
        </Link>
      )}

      {renderPagination()}
      {currentPage === pageSize ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2 shadow-sm'>Next</span>
      ) : (
        <Link
          to={{
            pathname,
            search: createSearchParams({ ...queryConfig, page: (currentPage + 1).toString() }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
        >
          Next
        </Link>
      )}
    </div>
  )
}
