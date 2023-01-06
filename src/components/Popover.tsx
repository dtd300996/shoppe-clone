import { ElementType, useRef, useState } from 'react'
import { FloatingPortal, useFloating, arrow, shift, offset, Placement } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
  placement?: Placement
}

export default function Popover({
  children,
  renderPopover,
  className,
  as: Element = 'div',
  initialOpen = false,
  placement = 'bottom-end'
}: Props) {
  const [open, setOpen] = useState(initialOpen)

  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement
  })

  const showPopover = () => {
    setOpen(true)
  }
  const hidePopover = () => {
    setOpen(false)
  }

  const variants = {
    open: { opacity: 1, scale: 1 },
    close: { opacity: 0, scale: 0 },
    duration: 0.2
  }

  return (
    <Element ref={reference} className={className} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}

      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={variants.close}
              animate={variants.open}
              exit={variants.close}
              transition={{ duration: variants.duration }}
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
            >
              <div className='round-sm relative border border-gray-200 bg-white shadow-md'>
                <span
                  ref={arrowRef}
                  className='absolute -translate-y-full border-[11px] border-x-transparent border-b-white border-t-transparent'
                  style={{ left: middlewareData.arrow?.x, top: middlewareData.arrow?.y }}
                />
                {renderPopover}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
