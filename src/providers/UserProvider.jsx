import { createContext, useContext, useState } from "react"

const UserProviderContext = createContext({
  user: null,
  setUser: () => null,
})

export function UserProvider({
  children,
  defaultUser = null,
  storageKey = "current-user",
  ...props
}) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem(storageKey)
    const normalized = stored ? Number(stored) : defaultUser
    return normalized === 1 || normalized === 2 ? normalized : null
  })

  const value = {
    user,
    setUser: (user) => {
      const normalized = Number(user)
      if (normalized !== 1 && normalized !== 2) {
        console.warn(`Invalid user: ${user}`)
        return
      }

      sessionStorage.setItem(storageKey, normalized)
      setUser(normalized)
    },
  }

  return (
    <UserProviderContext.Provider {...props} value={value}>
      {children}
    </UserProviderContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserProviderContext)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}