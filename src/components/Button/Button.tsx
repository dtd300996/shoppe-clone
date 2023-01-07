import { ButtonHTMLAttributes } from 'react'
import { LoadingSvg } from 'src/assets/icons'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export default function Button({ className, isLoading, children, ...restProps }: Props) {
  const newClassName = restProps.disabled ? className + ' cursor-not-allowed' : className

  return (
    <button {...restProps} className={newClassName}>
      {isLoading && <LoadingSvg className='mr-2 h-4 w-4 animate-spin fill-white text-gray-200' />}
      {children}
    </button>
  )
}
