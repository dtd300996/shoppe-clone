import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login } from 'src/api/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { EmailPasswordSchema, emailPasswordSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import path from 'src/constants/path'
import { Helmet } from 'react-helmet-async'

type FormState = EmailPasswordSchema

export default function Login() {
  const { setAuthContext } = useContext(AppContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormState>({
    resolver: yupResolver(emailPasswordSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: EmailPasswordSchema) => login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        // setIsAuthenticated(true)
        // setProfile(res.data.data.user)
        setAuthContext(res.data.data.user)
        toast.success('Logged in successfully')
        const oldUrl = searchParams.get('url') || path.home

        navigate(oldUrl)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<EmailPasswordSchema>>(error)) {
          const formError = error?.response?.data?.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              const newKey = key as keyof EmailPasswordSchema
              const msg = formError[newKey]

              setError(newKey, {
                message: msg,
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
        <title>Login</title>
        <meta name='description' content='Login Clone shoppe' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Login</div>
              <Input
                name='email'
                register={register}
                type='email'
                placeholder='Email'
                errorMessage={errors.email?.message}
                className='mt-8'
                autoComplete='username'
              />
              <Input
                name='password'
                register={register}
                type='password'
                placeholder='Password'
                className='mt-2'
                autoComplete='on'
                errorMessage={errors.password?.message}
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                >
                  Login
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center text-center'>
                <span className='text-gray-400'>Do not have an account?</span>
                <Link className='ml-1 text-red-400' to={path.register}>
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
