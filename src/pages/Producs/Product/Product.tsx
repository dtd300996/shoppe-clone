import { Link } from 'react-router-dom'
import { StarSolidSvg } from 'src/assets/icons'

export default function Product() {
  return (
    <Link to='/' className=''>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.0625rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%] '>
          <img
            src='https://via.placeholder.com/150'
            alt='product-1'
            className='absolute top-0 left-0 h-full w-full bg-white'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[2rem] text-xs line-clamp-2'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            quos unde rem a doloribus expedita!
          </div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span>200</span>
              <span className='text-sx'>$</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span>100</span>
              <span className='text-sx'>$</span>
            </div>
          </div>
          <div className='flex-items-center mt-3 flex justify-end'>
            <div className='flex items-center'>
              <div className='relative'>
                <div
                  className='absolute top-0 left-0 h-full overflow-hidden'
                  style={{ width: '50%' }}
                >
                  <StarSolidSvg className='h-3 w-3 fill-yellow-300 text-yellow-300 ' />
                </div>
                <StarSolidSvg className='h-3 w-3 fill-current text-gray-300 ' />
              </div>
            </div>
            <div className='ml-2 text-sm'>
              <span>99.9k</span>
              <span className='ml-1'>sold</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
