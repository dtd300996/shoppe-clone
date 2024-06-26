import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerAccount } from 'src/api/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { EmailPasswordSchema, schema, Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

export const formSchema = schema.pick(['email', 'password', 'confirm_password'])
export type FormState = Pick<Schema, 'email' | 'password' | 'confirm_password'>

export default function Register() {
  const { setAuthContext } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormState>({
    resolver: yupResolver(formSchema)
  })

  const resisterAccountMutation = useMutation({
    mutationFn: (body: EmailPasswordSchema) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])

    resisterAccountMutation.mutate(body, {
      onSuccess: (res) => {
        // setIsAuthenticated(true)
        // setProfile(res.data.data.user)
        setAuthContext(res.data.data.user)
        toast.success('Sign Up Success')
        navigate(path.home)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<EmailPasswordSchema>>(error)) {
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
      <Helmet>
        <title>Register</title>
        <meta name='description' content='Register Clone shoppe' />
      </Helmet>
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
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
                  disabled={resisterAccountMutation.isLoading}
                  isLoading={resisterAccountMutation.isLoading}
                >
                  Register
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center text-center'>
                <span className='text-gray-400'>Do you already have an account?</span>
                <Link className='ml-1 text-red-400' to={path.login}>
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
