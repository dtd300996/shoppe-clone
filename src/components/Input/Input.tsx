import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder?: string
  className?: string
  autoComplete?: string
  name: string
  register: UseFormRegister<any>
  rules?: RegisterOptions
}
export default function Input({
  type,
  errorMessage,
  placeholder,
  className,
  name,
  register,
  rules,
  autoComplete
}: Props) {
  return (
    <div className={className}>
      <input
        type={type}
        className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
        placeholder={placeholder}
        {...register(name, rules)}
        autoComplete={autoComplete}
      />
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
    </div>
  )
}
