import { createContext, useState } from 'react'
import { Purchase } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'

type ProfileType = User | null
type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>

interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
}
interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: SetStateType<boolean>
  profile: ProfileType
  setProfile: SetStateType<ProfileType>
  setAuthContext: (profile: ProfileType) => void
  extendedPurchases: ExtendedPurchase[]
  setExtendedPurchases: SetStateType<ExtendedPurchase[]>
  reset: () => void
}

export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  setAuthContext: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null
})

const initialAppContext = getInitialAppContext()

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({
  children,
  defaultValue = initialAppContext
}: {
  children?: React.ReactNode
  defaultValue?: AppContextInterface
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultValue.isAuthenticated)
  const [profile, setProfile] = useState<ProfileType>(defaultValue.profile)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])

  const setAuthContext = (profile: ProfileType) => {
    const isAuth = Boolean(profile)
    setIsAuthenticated(isAuth)
    setProfile(profile)
  }

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
    setExtendedPurchases([])
  }

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    profile,
    setProfile,
    setAuthContext,
    extendedPurchases,
    setExtendedPurchases,
    reset
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
