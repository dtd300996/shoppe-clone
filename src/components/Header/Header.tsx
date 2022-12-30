import { useRef, useState } from 'react'
import { FloatingPortal, useFloating, arrow, shift, offset } from '@floating-ui/react'
import { Link } from 'react-router-dom'
import { CartSvg, ChevronDownSvg, GlobalSvg, LogoSvg, SearchSvg } from 'src/assets/icons'
import { AnimatePresence, motion } from 'framer-motion'

export default function Header() {
  const [open, setOpen] = useState(true)

  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })]
  })

  const showPopover = () => setOpen(true)
  const hidePopover = () => setOpen(false)

  const variants = {
    open: { opacity: 1, scale: 1, transformOrigin: '50% 0%' },
    close: { opacity: 0, scale: 0 }
  }

  return (
    <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2 text-white'>
      <div className='container'>
        <div className='flex justify-end'>
          <div
            ref={reference}
            className='flex cursor-pointer items-center py-1 hover:text-gray-300'
            onMouseEnter={showPopover}
            onMouseLeave={hidePopover}
          >
            <GlobalSvg className='h-5 w-5' />
            <span className='mx-1'>Vietnamese</span>
            <ChevronDownSvg className='h-5 w-5' />

            <FloatingPortal>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    // animate={open ? 'open' : 'close'}
                    // variants={variants}
                    animate={variants.open}
                    exit={variants.close}
                    transition={{ duration: 0.2 }}
                    ref={floating}
                    style={{
                      position: strategy,
                      top: y ?? 0,
                      left: x ?? 0,
                      width: 'max-content',
                      transformOrigin: `${middlewareData.arrow?.x}px top`
                    }}
                    // onMouseEnter={showPopover}
                    // onMouseLeave={hidePopover}
                  >
                    <div className='round-sm relative border border-gray-200 bg-white shadow-md'>
                      <span
                        ref={arrowRef}
                        className='absolute -translate-y-full border-[11px] border-x-transparent border-b-white border-t-transparent'
                        style={{ left: middlewareData.arrow?.x, top: middlewareData.arrow?.y }}
                      />
                      <div className='flex flex-col py-2 px-3'>
                        <button className='py-2 px-3 hover:text-orange'>Vietnamese</button>
                        <button className='py-2 px-3 hover:text-orange'>English</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </FloatingPortal>
          </div>

          <div className='ml-6 flex cursor-pointer items-center py-1 hover:text-gray-300'>
            <div className='mr-2 h-5 w-5 flex-shrink-0'>
              <img
                src='https://i1-giaitri.vnecdn.net/2022/12/15/avatar-2-1-jpeg-2238-1671050566.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=Gjwi0rqvUSZXSzXx1YrqaA'
                alt='avatar'
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <div>DTD96</div>
          </div>
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
