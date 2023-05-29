import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import purchaseApi from 'src/api/purchase.api'
import { CartSvg, LogoSvg, SearchSvg } from 'src/assets/icons'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import useSearchProducts from 'src/hooks/useSearchProducts'
import { formatCurrency } from 'src/utils/utils'
import NavHeader from '../NavHeader'
import Popover from '../Popover/Popover'

const MAX_PURCHASE = 5
export default function Header() {
  const { onSubmitSearch, register } = useSearchProducts()

  const { isAuthenticated } = useContext(AppContext)

  const { data: purchasesIncartData } = useQuery({
    queryKey: ['purchase', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesIncart = purchasesIncartData?.data.data

  return (
    <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2 text-white'>
      <div className='container'>
        <NavHeader />
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
                <div className='relative min-w-[350px] max-w-[400px] rounded-sm bg-white text-sm shadow-md'>
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
