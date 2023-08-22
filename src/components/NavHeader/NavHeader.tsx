import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logout } from 'src/api/auth.api'
import { ChevronDownSvg, GlobalSvg } from 'src/assets/icons'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { getAvatarUrl, isAxiosError } from 'src/utils/utils'
import Popover from '../Popover'
import { useTranslation } from 'react-i18next'

export default function NavHeader() {
  const { isAuthenticated, profile, setAuthContext } = useContext(AppContext)
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: logout
  })

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: (res) => {
        toast.success(res.data.message)
        // setIsAuthenticated(false)
        // setProfile(null)
        setAuthContext(null)
        queryClient.removeQueries(['purchase', { status: purchasesStatus.inCart }])
      },
      onError: (error) => {
        if (isAxiosError<ErrorResponse<unknown>>(error)) {
          toast.error(error.response?.data.message)
        } else {
          toast.error('ERRRRRRR!!!')
        }
      }
    })
  }

  const { i18n } = useTranslation()
  const currentLng = i18n.language
  const changeLanguage = (lng: 'en' | 'vi') => () => {
    i18n.changeLanguage(lng)
    localStorage.setItem('i18n-lng', lng)
  }

  return (
    <div className='flex justify-end'>
      <Popover
        renderPopover={
          <div className='flex flex-col py-2 px-3 pr-20 pl-3'>
            <button className='py-2 px-3 text-left hover:text-orange' onClick={changeLanguage('vi')}>
              Vietnamese
            </button>
            <button className='py-2 px-3 text-left hover:text-orange' onClick={changeLanguage('en')}>
              English
            </button>
          </div>
        }
        className='flex cursor-pointer items-center py-1 hover:text-white/70'
      >
        <GlobalSvg className='h-5 w-5' />
        <span className='mx-1'>{currentLng}</span>
        <ChevronDownSvg className='h-5 w-5' />
      </Popover>

      {isAuthenticated && (
        <Popover
          className='ml-6 flex cursor-pointer items-center py-1  hover:text-white/70'
          renderPopover={
            <div className='flex flex-col py-3 px-4'>
              <Link to={path.profile} className='py-2 px-3 text-left hover:text-orange'>
                My account
              </Link>
              <Link to='/' className='py-2 px-3 text-left hover:text-orange'>
                Orders
              </Link>
              <button className='py-2 px-3 text-left hover:text-orange' onClick={handleLogout}>
                Logout
              </button>
            </div>
          }
          as={'span'}
        >
          <div className='mr-2 h-5 w-5 flex-shrink-0'>
            <img src={getAvatarUrl(profile?.avatar)} alt='avatar' className='h-full w-full rounded-full object-cover' />
          </div>
          <div>{profile?.name || profile?.email}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            Register
          </Link>
          <div className='h-4 border-r-[1px] border-r-white/40' />
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            Login
          </Link>
        </div>
      )}
    </div>
  )
}
