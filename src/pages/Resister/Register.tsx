import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { registerAccount } from 'src/api/auth.api'
import Input from 'src/components/Input'
import { schema, Schema, EmailPasswordSchema } from 'src/utils/rules'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ResponseApi } from 'src/types/utils.type'

type FormState = Schema

export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormState>({
    resolver: yupResolver(schema)
  })

  const resisterAccountMutation = useMutation({
    mutationFn: (body: EmailPasswordSchema) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])

    resisterAccountMutation.mutate(body, {
      onSuccess: (data) => {
        console.log({ data })
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<EmailPasswordSchema>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              const newKey = key as keyof EmailPasswordSchema

              setError(newKey, {
                message: formError[newKey],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Register</div>
              <Input
                name='email'
                register={register}
                type='email'
                autoComplete='username'
                className='mt-8'
                placeholder='Email'
                errorMessage={errors.email?.message}
              />
              <Input
                name='password'
                register={register}
                type='password'
                autoComplete='new-password'
                className='mt-2'
                placeholder='Password'
                errorMessage={errors.password?.message}
              />
              <Input
                name='confirm_password'
                register={register}
                type='password'
                autoComplete='new-password'
                className='mt-2'
                placeholder='Confirm password'
                errorMessage={errors.confirm_password?.message}
              />

              <div className='mt-2'>
                <button
                  type='submit'
                  className='w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
                >
                  Register
                </button>
              </div>
              <div className='mt-8 flex items-center justify-center text-center'>
                <span className='text-gray-400'>Do you already have an account?</span>
                <Link className='ml-1 text-red-400' to='/login'>
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}