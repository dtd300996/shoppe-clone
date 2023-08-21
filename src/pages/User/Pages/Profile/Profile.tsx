import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/api/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputFile from 'src/components/InputFile'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { setProfileToLS } from 'src/utils/auth'
import { UserSchema, userSchema } from 'src/utils/rules'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & { date_of_birth?: string }

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  const [file, setFile] = useState<File | undefined>()
  const previewImage = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  const { setProfile } = useContext(AppContext)
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setError
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      avatar: '',
      address: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })

  const { isLoading, ...updateProfileMutation } = useMutation(userApi.updateProfile)
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)

  const profile = profileData?.data.data

  const avatar = profile?.avatar

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  // Flow 1 (spam upload)
  // Click upload: call api upload img => url
  // Submit: call api update profile

  // Flow 2
  // Click upload: KHÔNG upload lên sv
  // Submit: call api upload img => url => call api update profile

  const onSubmit = handleSubmit(async ({ date_of_birth, ...data }) => {
    try {
      if (isLoading) return
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
      }

      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: date_of_birth?.toISOString(),
        avatar: avatarName
      })
      const profile = res.data.data
      setProfile(profile)
      setProfileToLS(profile)
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      console.log({ error })

      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            const newKey = key as keyof FormDataError

            setError(newKey, {
              message: formError[newKey],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChangeFile = (file: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>My profile</h1>
        <div className='mt-1 text-sm text-gray-700'>Manage profile information for account security</div>
      </div>
      <form onSubmit={onSubmit} className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <div className='form mt-6 flex-grow md:mt-0 md:pr-20'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Name</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>
                <Input
                  register={register}
                  name='name'
                  placeholder='Name'
                  errorMessage={errors.name?.message}
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                />
              </div>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Phone</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder='Phone'
                      errorMessage={errors.phone?.message}
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      // onChange={() => {
                      //   field.onChange()
                      // }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Address</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>
                <Input
                  register={register}
                  name='address'
                  placeholder='Address'
                  errorMessage={errors.address?.message}
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                />
              </div>
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect
                // {...field}
                errorMessage={errors.date_of_birth?.message}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
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
        <div className='flex justify-center md:w-72 md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                // src='https://cf.shopee.vn/file/d04ea22afab6e6d250a370d7ccc2e675_tn'
                src={
                  previewImage ||
                  getAvatarUrl(avatar) ||
                  'https://cf.shopee.vn/file/d04ea22afab6e6d250a370d7ccc2e675_tn'
                }
                alt=''
                className='object-fit h-full w-full rounded-full'
              />
            </div>
            <InputFile onChange={handleChangeFile} />
            <div>
              <div className='mt-3 text-gray-400'>
                <div>maximum size 1MB</div>
                <div>Format: .JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
