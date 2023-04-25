import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { isUndefined, omit, omitBy } from 'lodash'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeftActiveSvg, FilterSvg, Menu3DotSvg } from 'src/assets/icons'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Category } from 'src/types/category.type'
import { PriceSchema, priceSchema } from 'src/utils/rules'
import RatingStar from '../RatingStar'
import InputV2 from 'src/components/InputV2'

type Props = {
  queryConfig: QueryConfig
  pathname: string
  categories: Category[]
}

export default React.memo(function AsideFilter({ queryConfig, pathname, categories }: Props) {
  const { category: categoryQueryParam } = queryConfig
  const navigate = useNavigate()

  const createSearchParamsWithQueryConfig = (queryConfig: QueryConfig = {}) => {
    return createSearchParams({ ...queryConfig }).toString()
  }

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    reset
  } = useForm<PriceSchema>({
    defaultValues: {
      price_min: '',
      price_max: queryConfig.price_max || ''
    },
    resolver: yupResolver(priceSchema)
    // shouldFocusError: false
  })

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname,
      search: createSearchParamsWithQueryConfig(omitBy({ ...queryConfig, ...data }, isUndefined))
    })
  })

  const handleRemoveAll = () => {
    reset({
      price_min: '',
      price_max: ''
    })

    navigate({
      pathname,
      search: createSearchParamsWithQueryConfig(
        omit({ ...queryConfig }, ['category', 'price_min', 'price_max', 'rating_filter'])
      )
    })
  }

  return (
    <div className='py-4'>
      {!!categories.length && (
        <>
          <Link
            to={{
              pathname,
              search: createSearchParamsWithQueryConfig(omit({ ...queryConfig }, ['category']))
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
                      search: createSearchParamsWithQueryConfig({ ...queryConfig, category: category._id })
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
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='items-star flex'>
            {/* <Controller
              control={control}
              name='price_min'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
                  classNameError='d-none'
                  placeholder='$ From'
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    trigger('price_max')
                  }}
                />
              )}
            /> */}

            <InputV2
              control={control}
              name='price_min'
              classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
              classNameError='d-none'
              placeholder='$ From'
              className='grow'
              type='number'
              onChange={() => {
                trigger('price_max')
              }}
            />

            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
                  classNameError='d-none'
                  placeholder='$ To'
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    trigger('price_min')
                  }}
                />
              )}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>
            {errors.price_min?.message || errors.price_max?.message}
          </div>
          <Button className='w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
            Apply
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='text-sm'>Review</div>
      <RatingStar pathname={pathname} queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <Button
        onClick={handleRemoveAll}
        className='w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'
      >
        Delete all
      </Button>
    </div>
  )
})
