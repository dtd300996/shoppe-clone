import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import path from 'src/constants/path'
import { useContext } from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logout } from 'src/api/auth.api'
import { CartSvg, ChevronDownSvg, GlobalSvg, LogoSvg, SearchSvg } from 'src/assets/icons'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { formatCurrency, isAxiosError } from 'src/utils/utils'
import Popover from '../Popover/Popover'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { purchasesStatus } from 'src/constants/purchase'
import purchaseApi from 'src/api/purchase.api'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

const MAX_PURCHASE = 5
export default function Header() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: { name: '' },
    resolver: yupResolver(nameSchema)
  })

  const { isAuthenticated, profile, setAuthContext } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: logout
  })

  const { data: purchasesIncartData } = useQuery({
    queryKey: ['purchase', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesIncart = purchasesIncartData?.data.data

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: (res) => {
        toast.success(res.data.message)
        // setIsAuthenticated(false)
        // setProfile(null)
        setAuthContext(null)
        queryClient.removeQueries(['purchase', { status: purchasesStatus.inCart }])
      },
      onError: (error) => {
        if (isAxiosError<ErrorResponse<unknown>>(error)) {
          toast.error(error.response?.data.message)
        } else {
          toast.error('ERRRRRRR!!!')
        }
      }
    })
  }

  const onSubmitSearch = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit({ ...queryConfig, name: data.name }, ['sort_by', 'order'])).toString()
    })
  })

  return (
    <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2 text-white'>
      <div className='container'>
        <div className='flex justify-end'>
          <Popover
            renderPopover={
              <div className='flex flex-col py-2 px-3 pr-20 pl-3'>
                <button className='py-2 px-3 text-left hover:text-orange'>Vietnamese</button>
                <button className='py-2 px-3 text-left hover:text-orange'>English</button>
              </div>
            }
            className='flex cursor-pointer items-center py-1 hover:text-white/70'
          >
            <GlobalSvg className='h-5 w-5' />
            <span className='mx-1'>Vietnamese</span>
            <ChevronDownSvg className='h-5 w-5' />
          </Popover>

          {isAuthenticated && (
            <Popover
              className='ml-6 flex cursor-pointer items-center py-1  hover:text-white/70'
              renderPopover={
                <div className='flex flex-col py-3 px-4'>
                  <Link to={path.profile} className='py-2 px-3 text-left hover:text-orange'>
                    My account
                  </Link>
                  <Link to='/' className='py-2 px-3 text-left hover:text-orange'>
                    Orders
                  </Link>
                  <button className='py-2 px-3 text-left hover:text-orange' onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              }
              as={'span'}
            >
              <div className='mr-2 h-5 w-5 flex-shrink-0'>
                <img
                  src='https://i1-giaitri.vnecdn.net/2022/12/15/avatar-2-1-jpeg-2238-1671050566.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=Gjwi0rqvUSZXSzXx1YrqaA'
                  alt='avatar'
                  className='h-full w-full rounded-full object-cover'
                />
              </div>
              <div>{profile?.name || profile?.email}</div>
            </Popover>
          )}
          {!isAuthenticated && (
            <div className='flex items-center'>
              <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
                Register
              </Link>
              <div className='h-4 border-r-[1px] border-r-white/40' />
              <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
                Login
              </Link>
            </div>
          )}
        </div>
        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          <Link to='/' className='col-span-2'>
            <LogoSvg className='h-11 w-full fill-white' />
          </Link>
          <form className='col-span-9' onSubmit={onSubmitSearch}>
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                placeholder='Free shipping for orders from 0$'
                className='flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
                {...register('name')}
              />
              <button className='flex-shrink-0 rounded-sm bg-orange py-2 px-6 hover:opacity-90'>
                <SearchSvg className='h-6 w-6' />
              </button>
            </div>
          </form>
          <div className='col-span-1 justify-self-end'>
            <Popover
              placement='bottom-end'
              className=''
              renderPopover={
                <div className='relative max-w-[400px] rounded-sm bg-white text-sm shadow-md'>
                  {!purchasesIncart?.length && <div className='p-2'>No products in the cart </div>}
                  {purchasesIncart?.length && (
                    <div className='p-2'>
                      <div className='capitalize text-gray-400'>New products</div>
                      <div className='mt-5'>
                        {purchasesIncart.slice(0, MAX_PURCHASE).map((purchase) => (
                          <div className='mt-2 flex py-2 hover:bg-gray-100' key={purchase._id}>
                            <div className='flex-shrink-0'>
                              <img src={purchase.product.image} alt='product-1' className='h-11 w-11 object-cover' />
                            </div>
                            <div className='ml-2 flex-grow overflow-hidden'>
                              <div className='truncate'>{purchase.product.name} </div>
                            </div>
                            <div className='ml-2 flex-shrink-0'>
                              <div className='text-orange'>
                                {formatCurrency(purchase.product.price_before_discount)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className='mt-6 flex items-center justify-between'>
                        <div className='text-xs capitalize text-gray-500'>
                          {purchasesIncart.length > MAX_PURCHASE
                            ? `${purchasesIncart.length - MAX_PURCHASE} add to cart`
                            : ''}
                        </div>
                        <Link
                          to={path.cart}
                          className='rounded-sm bg-orange px-4 py-2 capitalize text-white hover:bg-opacity-80'
                        >
                          View cart
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              }
              as={'span'}
            >
              <Link to={path.cart} className='relative'>
                <CartSvg className='h-8 w-8' />
                {isAuthenticated && (
                  <span className='absolute top-[-6px] right-[-15px] rounded-full bg-white px-[9px] py-[1px] text-orange'>
                    {purchasesIncart?.length}
                  </span>
                )}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
