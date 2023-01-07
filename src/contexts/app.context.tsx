import { createContext, useState } from 'react'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'

type ProfileType = User | null
type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: SetStateType<boolean>
  profile: ProfileType
  setProfile: SetStateType<ProfileType>
  setAuthContext: (profile: ProfileType) => void
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  setAuthContext: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<ProfileType>(initialAppContext.profile)

  const setAuthContext = (profile: ProfileType) => {
    const isAuth = Boolean(profile)
    setIsAuthenticated(isAuth)
    setProfile(profile)
  }

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    profile,
    setProfile,
    setAuthContext
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
