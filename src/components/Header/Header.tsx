import { Link } from 'react-router-dom'
import { CartSvg, ChevronDownSvg, GlobalSvg, LogoSvg, SearchSvg } from 'src/assets/icons'
import Popover from '../Popover'

export default function Header() {
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
            className='flex cursor-pointer items-center py-1 hover:text-gray-300'
          >
            <GlobalSvg className='h-5 w-5' />
            <span className='mx-1'>Vietnamese</span>
            <ChevronDownSvg className='h-5 w-5' />
          </Popover>

          <Popover
            className='ml-6 flex cursor-pointer items-center py-1  hover:text-gray-300'
            renderPopover={
              <div className='flex flex-col py-3 px-4'>
                <Link to='/' className='py-2 px-3 text-left hover:text-orange'>
                  My account
                </Link>
                <Link to='/' className='py-2 px-3 text-left hover:text-orange'>
                  Orders
                </Link>
                <button className='py-2 px-3 text-left hover:text-orange'>Logout</button>
              </div>
            }
            initialOpen={true}
            as={'span'}
          >
            <div className='mr-2 h-5 w-5 flex-shrink-0'>
              <img
                src='https://i1-giaitri.vnecdn.net/2022/12/15/avatar-2-1-jpeg-2238-1671050566.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=Gjwi0rqvUSZXSzXx1YrqaA'
                alt='avatar'
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <div>DTD96</div>
          </Popover>
        </div>
        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          <Link to='/' className='col-span-2'>
            <LogoSvg className='h-11 fill-white' />
          </Link>
          <form className='col-span-9'>
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                placeholder='Free shipping for orders from 0$'
                className='flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
              />
              <button className='flex-shrink-0 rounded-sm bg-orange py-2 px-6 hover:opacity-90'>
                <SearchSvg />
              </button>
            </div>
          </form>
          <div className='col-span-1 justify-end'>
            <Link to='/cart' className=''>
              <CartSvg className='h-8 w-8' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
