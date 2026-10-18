import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"

const getStoredProfile = (user) => {
  try {
    const stored = JSON.parse(localStorage.getItem(`vacation-profile-${user?.id ?? "guest"}`) ?? "null")
    const name = stored?.fullName ?? user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? ""
    const [metadataFirstName = "", ...metadataLastName] = name.trim().split(/\s+/).filter(Boolean)
    return {
      firstName: stored?.firstName ?? metadataFirstName,
      lastName: stored?.lastName ?? metadataLastName.join(" "),
    }
  } catch {
    return { firstName: "", lastName: "" }
  }
}

export const ProfileCompletionGate = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => getStoredProfile(user))

  useEffect(() => {
    const refresh = () => setProfile(getStoredProfile(user))
    refresh()
    window.addEventListener("profile-updated", refresh)
    return () => window.removeEventListener("profile-updated", refresh)
  }, [user?.id])

  useEffect(() => {
    const complete = Boolean(profile.firstName?.trim() && profile.lastName?.trim())
    if (user && !complete && location.pathname !== "/profile") navigate("/profile", { replace: true })
  }, [location.pathname, navigate, profile, user])

  return children
}
