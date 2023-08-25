import { InputHTMLAttributes, useMemo, useState } from 'react'
import { FieldPath, FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<T>
  name?: FieldPath<T>
  rules?: RegisterOptions
}

export default function Input<T extends FieldValues>({
  errorMessage,
  className,
  name,
  register,
  rules,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  ...restProps
}: Props<T>) {
  const registerResult = register && name ? register(name, rules) : {}
  const { type } = restProps
  const [showPassword, setShowPassword] = useState(false)
  const currentType = useMemo(() => (type === 'password' && showPassword ? 'text' : type), [type, showPassword])

  const handleTogglePassword = () => {
    if (type === 'password') {
      setShowPassword((prev) => !prev)
    }
  }

  return (
    <div className={className}>
      <div className='relative'>
        <input {...restProps} className={classNameInput} {...registerResult} type={currentType} />
        {type === 'password' && (
          <button
            className='absolute top-[50%] right-1 w-[50px] translate-y-[-50%] bg-gray-200 p-1'
            type='button'
            onClick={handleTogglePassword}
          >
            {showPassword ? 'hide' : 'show'}
          </button>
        )}
      </div>
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
