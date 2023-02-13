import classNames from 'classnames'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { StarSvg } from 'src/assets/icons'
import { QueryConfig } from '../../Products'

type Props = {
  queryConfig: QueryConfig
  pathname: string
}
export default function RatingStar({ pathname, queryConfig }: Props) {
  const navigate = useNavigate()
  const handleFilterStar = (rating: number) => () => {
    navigate({
      pathname,
      search: createSearchParams({ ...queryConfig, rating_filter: rating.toString() }).toString()
    })
  }

  return (
    <ul className='my-3'>
      {Array(5)
        .fill('1')
        .map((_, index) => (
          <li
            key={index}
            className={classNames('py-1 pl-2', {
              'bg-slate-300/50': queryConfig.rating_filter === String(5 - index)
            })}
          >
            <button
              className='flex items-center text-sm'
              onClick={handleFilterStar(5 - index)}
              // tag div
              //    |
              // tabIndex={0}
              // role='button'
              // aria-hidden='true'
            >
              {Array(5 - index)
                .fill('1')
                .map((_, i) => (
                  <StarSvg className='mr-1 h-4 w-4 fill-yellow-500 text-yellow-500' key={i} />
                ))}{' '}
              {Array(index)
                .fill('1')
                .map((_, j) => (
                  <StarSvg className='mr-1 h-4 w-4 fill-transparent text-yellow-500' key={j} />
                ))}{' '}
              {index !== 0 && (
                <span
                  className={classNames({
                    'text-orange': queryConfig.rating_filter === String(5 - index)
                  })}
                >
                  or more
                </span>
              )}
            </button>
          </li>
        ))}
    </ul>
  )
}
