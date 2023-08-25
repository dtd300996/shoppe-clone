import { InputHTMLAttributes, useState } from 'react'
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  classNameError?: string
}

export default function InputV2<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: UseControllerProps<TFieldValues, TName> & InputNumberProps) {
  const {
    type,
    onChange,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const { value } = field
  const [localValue, setLocalValue] = useState<string>(field.value)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const { value: valueFromInput } = e.target
      const numberCondition = (type === 'number' && /^\d+$/.test(valueFromInput)) || valueFromInput === ''

      if (numberCondition || type !== 'number') {
        setLocalValue(valueFromInput)
        field.onChange(e)
        onChange && field.onChange(e)
      }
    }
  }
  return (
    <div className={className}>
      <input
        {...rest}
        {...field}
        className={classNameInput}
        onChange={handleChange}
        value={value === undefined ? localValue : value}
      />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}
