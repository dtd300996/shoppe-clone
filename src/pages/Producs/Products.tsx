import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProducts from './SortProducts'

export default function Products() {
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter />
          </div>
          <div className='col-span-9 '>
            <SortProducts />
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {Array(30)
                .fill(9)
                .map((_, index) => (
                  <div className='col-span-1' key={index}>
                    <Product />
                  </div>
                ))}
              <Product />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
