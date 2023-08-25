import { forwardRef, InputHTMLAttributes, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export default forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  {
    errorMessage,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    onChange,
    value = '',
    ...restProps
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const { value } = e.target
      if (/^\d+$/.test(value) || value === '') {
        onChange && onChange(e)
        setLocalValue(value)
      }
    }
  }
  return (
    <div className={className}>
      <input
        {...restProps}
        className={classNameInput}
        onChange={handleChange}
        ref={ref}
        value={value === undefined ? localValue : value}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})
