import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/api/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/utils.type'
import { userSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import * as yup from 'yup'

const changePassworkSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])
export type FormData = yup.InferType<typeof changePassworkSchema>

export default function ChangePasswork() {
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(changePassworkSchema)
  })

  const { isLoading, ...updateProfileMutation } = useMutation(userApi.updateProfile)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      console.log({ error })

      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            const newKey = key as keyof FormData

            setError(newKey, {
              message: formError[newKey],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>My profile</h1>
        <div className='mt-1 text-sm text-gray-700'>Change passwork</div>
      </div>
      <form onSubmit={onSubmit} className='mt-8 flex max-w-2xl flex-col-reverse md:flex-row md:items-start'>
        <div className='form mt-6 flex-grow md:mt-0 md:pr-20'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Password</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>
                <Input
                  type='password'
                  register={register}
                  name='password'
                  placeholder=''
                  errorMessage={errors.password?.message}
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>New password</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>
                <Input
                  type='password'
                  register={register}
                  name='new_password'
                  placeholder=''
                  errorMessage={errors.new_password?.message}
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Confirm password</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>
                <Input
                  type='password'
                  register={register}
                  name='confirm_password'
                  placeholder=''
                  errorMessage={errors.confirm_password?.message}
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                />
              </div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />

            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                className='round-sm hover:bg-range/80 flex h-9 items-center bg-orange px-5 text-center text-sm text-white'
                disabled={isLoading}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
