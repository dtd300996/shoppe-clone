import { ChevronLeftSvg, ChevronRightSvg } from 'src/assets/icons'

export default function SortProducts() {
  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Filter by</div>
          <button className='h-8 bg-orange px-4 text-center text-sm capitalize text-white hover:bg-orange/80'>
            Common
          </button>
          <button className='h-8 bg-white px-4 text-center text-sm capitalize text-black hover:bg-slate-100'>
            New
          </button>
          <button className='h-8 bg-white px-4 text-center text-sm capitalize text-black hover:bg-slate-100'>
            Best selling
          </button>
          <select
            className='h-8 bg-white px-4 text-left text-sm capitalize text-black outline-none hover:bg-slate-100'
            defaultValue=''
          >
            <option value='' disabled>
              Price
            </option>
            <option value='price:asc'>Price: Low to high</option>
            <option value='price:desc'>Price: High to low</option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>1</span>
            <span className=''>/2</span>
          </div>
          <div className='ml-2 shadow-sm'>
            <button className='h-8 cursor-not-allowed rounded-tl-sm bg-white/60 px-3 hover:bg-slate-100'>
              <ChevronLeftSvg className='h-3 w-3' />
            </button>
            <button className='h-8  rounded-tr-sm bg-white px-3 hover:bg-slate-100'>
              <ChevronRightSvg className='h-3 w-3' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
