import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"

export const ProfileCompletionGate = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [profileLoadFailed, setProfileLoadFailed] = useState(false)

  useEffect(() => {
    if (!user) { setProfile(null); setProfileLoadFailed(false); return }
    let active = true
    const refresh = async () => {
      const { data, error } = await supabase.from("profiles").select("first_name, last_name").eq("id", user.id).maybeSingle()
      if (!active) return
      setProfileLoadFailed(Boolean(error))
      if (!error) setProfile(data ?? { first_name: "", last_name: "" })
    }
    refresh()
    window.addEventListener("profile-updated", refresh)
    return () => { active = false; window.removeEventListener("profile-updated", refresh) }
  }, [user?.id])

  useEffect(() => {
    if (!profile || profileLoadFailed) return
    const complete = Boolean(profile.first_name?.trim() && profile.last_name?.trim())
    if (user && !complete && location.pathname !== "/profile") navigate("/profile", { replace: true })
  }, [location.pathname, navigate, profile, profileLoadFailed, user])

  return children
}
