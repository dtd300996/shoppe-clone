import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useParams } from 'react-router-dom'
import productApi from 'src/api/product.api'
import { CartSvg, ChevronLeftSvg, ChevronRightSvg } from 'src/assets/icons'
import InputNumber from 'src/components/InputNumber'
import ProductRating from 'src/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from 'src/utils/utils'

export default function ProductDetail() {
  const { id } = useParams()

  const { data: productDetail } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id as string)
  })
  const product = productDetail?.data.data

  if (!product) {
    return null
  }

  return (
    <div className='bg-gray-200 py-6'>
      <div className='bg-white p-4 shadow'>
        <div className='container grid grid-cols-12 gap-9'>
          <div className='col-span-5'>
            <div className='relative w-full pt-[100%] shadow'>
              <img
                src={product.image}
                alt={product.name}
                className='absolute top-0 left-0 h-full w-full bg-white object-cover'
              />
            </div>
            <div className='relative mt-4 grid grid-cols-5 gap-1'>
              <button className='top absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'>
                <ChevronLeftSvg />
              </button>

              {product.images.slice(0, 5).map((img, index) => {
                const isActive = index === 0
                return (
                  <div key={img} className='relative w-full pt-[100%]'>
                    <img
                      src={img}
                      alt={product.name}
                      className='absolute top-0 left-0 h-full w-full bg-white object-cover'
                    />
                    {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                  </div>
                )
              })}

              <button className='top absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'>
                <ChevronRightSvg />
              </button>
            </div>
          </div>
          <div className='col-span-7'>
            <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
            <div className='mt-8 flex items-center'>
              <div className='flex items-center'>
                <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                <ProductRating
                  rating={product.rating}
                  activeClassname='fill-orange text-orange h-4 w-4'
                  nonActiveClassName='fill-gray-300 text-gray-300 h-4 w-4'
                />
              </div>
              <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
              <div>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
                <span className='ml-1 text-gray-500'>Sold</span>
              </div>
            </div>
            <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
              <div className='text-gray-500 line-through'>{formatCurrency(product.price_before_discount)}</div>
              <div className='ml-3 text-3xl font-medium text-orange'>{formatCurrency(product.price)}$</div>
              <div className='text-sx ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                {rateSale(product.price_before_discount, product.price)} discount
              </div>
            </div>
            <div className='mt-8 flex items-center'>
              <div className='capitalize text-gray-500'>Quantity</div>
              <div className='ml-10 flex items-center'>
                <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                  -
                </button>
                <InputNumber
                  value={1}
                  className=''
                  classNameError='hidden'
                  classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                />
                <button className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'>
                  +
                </button>

                <div className='ml-6 text-sm text-gray-500'>{product.quantity} products available</div>
              </div>
            </div>
            <div className='mt-8 flex items-center'>
              <button className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange hover:bg-orange/5'>
                <CartSvg className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange' /> Add to cart
              </button>
              <button className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'>
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 bg-white p-4 shadow'>
        <div className='container'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Product description </div>
          <div className='leading-lose mx-4 mt-12 mb-4 text-sm'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
