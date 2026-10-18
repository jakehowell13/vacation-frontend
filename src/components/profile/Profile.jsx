import { useEffect, useMemo, useState } from "react"
import { Camera, Check, Mail } from "lucide-react"
import { useAuth } from "@/providers/AuthProvider"

const emptyProfile = { firstName: "", lastName: "", avatar: "" }

export const Profile = () => {
  const { user } = useAuth()
  const storageKey = `vacation-profile-${user?.id ?? "guest"}`
  const [profile, setProfile] = useState(emptyProfile)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const metadata = user?.user_metadata ?? {}
    const storedProfile = JSON.parse(localStorage.getItem(storageKey) ?? "null")
    const fullName = storedProfile?.fullName ?? metadata.full_name ?? metadata.name ?? ""
    const [firstName = "", ...lastNameParts] = fullName.trim().split(/\s+/).filter(Boolean)
    setProfile({
      firstName: storedProfile?.firstName ?? firstName,
      lastName: storedProfile?.lastName ?? lastNameParts.join(" "),
      avatar: storedProfile?.avatar ?? "",
    })
  }, [storageKey, user])

  const displayName = `${profile.firstName} ${profile.lastName}`.trim()
  const initials = useMemo(() => `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase() || "VC", [profile.firstName, profile.lastName])

  const updateProfile = (field, value) => {
    setSaved(false)
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const uploadAvatar = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateProfile("avatar", String(reader.result))
    reader.readAsDataURL(file)
  }

  const saveProfile = (event) => {
    event.preventDefault()
    localStorage.setItem(storageKey, JSON.stringify(profile))
    window.dispatchEvent(new Event("profile-updated"))
    setSaved(true)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-1 pb-10 sm:px-0">
      <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-background shadow-xl shadow-primary/5">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/85 to-fuchsia-500 px-6 pb-20 pt-8 text-primary-foreground sm:px-10 sm:pt-10">
          <div className="absolute -right-16 -top-20 size-64 rounded-full bg-white/15 blur-3xl" />
          <p className="relative text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/75">Travel identity</p>
          <h1 className="relative mt-2 text-3xl font-black tracking-tight sm:text-4xl">Your profile</h1>
        </div>

        <form onSubmit={saveProfile} className="px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-[1.75rem] border-4 border-background bg-primary text-2xl font-black text-primary-foreground shadow-xl sm:size-28">
                {profile.avatar ? <img src={profile.avatar} alt="Profile" className="size-full object-cover" /> : initials}
                <label htmlFor="profile-avatar" className="absolute inset-0 grid cursor-pointer place-items-center bg-black/45 text-white opacity-0 transition hover:opacity-100"><Camera className="size-6" /><span className="sr-only">Upload profile photo</span></label>
              </div>
              <div className="pb-1"><p className="text-xl font-black">{displayName || "Your traveler profile"}</p><p className="mt-1 text-sm text-muted-foreground">The essentials, ready for your next trip.</p></div>
              <input id="profile-avatar" type="file" accept="image/*" onChange={uploadAvatar} className="sr-only" />
            </div>
            <label htmlFor="profile-avatar" className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/10"><Camera className="size-4" /> {profile.avatar ? "Change photo" : "Upload photo"}</label>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">First name<input required value={profile.firstName} onChange={(event) => updateProfile("firstName", event.target.value)} placeholder="First name" className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
            <label className="grid gap-2 text-sm font-bold">Last name<input required value={profile.lastName} onChange={(event) => updateProfile("lastName", event.target.value)} placeholder="Last name" className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
            <label className="grid gap-2 text-sm font-bold sm:col-span-2">Email <span className="sr-only">(from your account)</span><span className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={user?.email ?? ""} readOnly className="h-11 w-full rounded-xl border border-input bg-muted/50 py-2 pl-10 pr-3 font-normal text-muted-foreground outline-none" /></span><span className="text-xs font-normal text-muted-foreground">Connected to your Supabase account</span></label>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-primary/10 pt-6"><p className="text-sm text-muted-foreground">{saved ? "Profile saved on this device." : ""}</p><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"><Check className="size-4" /> Save profile</button></div>
        </form>
      </div>
    </div>
  )
}
