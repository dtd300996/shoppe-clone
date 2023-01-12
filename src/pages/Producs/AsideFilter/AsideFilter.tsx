import classNames from 'classnames'
import { omit } from 'lodash'
import React from 'react'
import { createSearchParams, Link } from 'react-router-dom'
import { ArrowLeftActiveSvg, FilterSvg, Menu3DotSvg, StarSolidSvg, StarSvg } from 'src/assets/icons'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'
import { QueryConfig } from '../Products'

type Props = {
  queryConfig: QueryConfig
  pathname: string
  categories: Category[]
}

export default React.memo(function AsideFilter({ queryConfig, pathname, categories }: Props) {
  const { category: categoryQueryParam } = queryConfig

  return (
    <div className='py-4'>
      {!!categories.length && (
        <>
          <Link
            to={{
              pathname,
              search: createSearchParams(omit({ ...queryConfig }, ['category'])).toString()
            }}
            className='flex items-center font-bold'
          >
            <Menu3DotSvg className='mr-3 h-4 w-3 fill-current' /> All categories
          </Link>
          <div className='my-4 h-[1px] bg-gray-300'></div>
          <ul>
            {categories.map((category) => {
              const isActive = categoryQueryParam === category._id
              return (
                <li className='py-2 pl-2' key={category._id}>
                  <Link
                    to={{
                      pathname,
                      search: createSearchParams({ ...queryConfig, category: category._id }).toString()
                    }}
                    className={classNames('relative px-2', {
                      'font-semibold text-orange': isActive
                    })}
                  >
                    {isActive && (
                      <ArrowLeftActiveSvg
                        className={classNames('absolute top-1 left-[-10px] h-2 w-2 fill-current text-inherit')}
                      />
                    )}
                    {category.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <FilterSvg className='mr-3 h-4 w-3 fill-current' /> Search filter
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='my-5'>
        <div>Range price</div>
        <form className='mt-2'>
          <div className='items-star mb-3 flex'>
            <Input
              type='text'
              className='grow'
              name='from'
              classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
              classNameError='d-none'
              placeholder='$ From'
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Input
              type='text'
              className='grow'
              name='to'
              classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
              classNameError='d-none'
              placeholder='$ To'
            />
          </div>
          <Button className='w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
            Apply
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='text-sm'>Review</div>
      <ul className='my-3'>
        <li className='py-1 pl-2'>
          <Link to='' className='flex items-center text-sm'>
            {Array(5)
              .fill('1')
              .map((_, index) => (
                <StarSolidSvg className='mr-1 h-4 w-4' key={index} />
              ))}{' '}
            <span>or more</span>
          </Link>
        </li>
        <li className='py-1 pl-2'>
          <Link to='' className='flex items-center text-sm'>
            {Array(4)
              .fill('1')
              .map((_, index) => (
                <StarSolidSvg className='mr-1 h-4 w-4' key={index} />
              ))}{' '}
            <StarSvg className='mr-1 h-4 w-4' />
            <span>or more</span>
          </Link>
        </li>
      </ul>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <Button className='w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
        Delete all
      </Button>
    </div>
  )
})
