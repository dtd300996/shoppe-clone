import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from 'src/utils/utils'

interface Props {
  product: ProductType
}
export default function Product({ product }: Props) {
  return (
    <Link to='/' className=''>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.0625rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%] '>
          <img src={product.image} alt={product.name} className='absolute top-0 left-0 h-full w-full bg-white' />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[2rem] text-xs line-clamp-2'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span>{formatCurrency(product.price_before_discount)}</span>
              <span className='text-sx'>$</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span>{formatCurrency(product.price)}</span>
              <span className='text-sx'>$</span>
            </div>
          </div>
          <div className='flex-items-center mt-3 flex justify-end'>
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-sm'>
              <span className='lowercase'>{formatNumberToSocialStyle(product.sold, ',')}</span>
              <span className='ml-1'>sold</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
