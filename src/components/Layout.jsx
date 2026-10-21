import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Home,
  PlaneTakeoff,
  Sparkles,
  MapPinned,
  NotebookPen,
  ChartColumnBig,
  Goal,
  Calendar,
  Lightbulb,
} from "lucide-react"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"

export const Layout = ({ children }) => {
  const location = useLocation()
  const { user } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    if (!user) { setAvatarUrl(""); return }
    let active = true
    const loadAvatar = async () => {
      const { data } = await supabase.from("profiles").select("avatar_path").eq("id", user.id).maybeSingle()
      if (active) setAvatarUrl(data?.avatar_path ? supabase.storage.from("profile-avatars").getPublicUrl(data.avatar_path).data.publicUrl : "")
    }
    loadAvatar()
    window.addEventListener("profile-updated", loadAvatar)
    return () => { active = false; window.removeEventListener("profile-updated", loadAvatar) }
  }, [user?.id])

  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: Home,
    },
    {
      to: "/trips",
      label: "Planner",
      icon: PlaneTakeoff,
    },
    {
      to: "/calendar",
      label: "Calendar",
      icon: Calendar,
    },
    // {
    //     to: "/goals",
    //     label: "Bucket List",
    //     icon: Goal,
    // },
    // {
    //   to: "/journal",
    //   label: "Journal",
    //   icon: NotebookPen,
    // },
    {
      to: "/finance",
      label: "Finance",
      icon: ChartColumnBig,
    },
    {
      to: "/vision",
      label: "Vision",
      icon: Lightbulb,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* DESKTOP / TABLET HEADER */}
      <header className="sticky top-0 z-40 border-b border-primary/15 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
              <MapPinned className="size-5" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                Vacation
              </p>

              <h1 className="text-lg font-black leading-none text-foreground sm:text-xl">
                Command Center
              </h1>
            </div>
          </Link>

          <div className="flex flex-row items-center gap-2">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 sm:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}

            <Link to="/profile" aria-label="Open profile" className="ml-2 hidden size-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-primary/10 text-xs font-black text-primary transition hover:border-primary lg:flex">
              {avatarUrl ? <img src={avatarUrl} alt="Your profile" className="size-full object-cover" /> : (user?.email?.[0] ?? "V").toUpperCase()}
            </Link>
          </nav>
          </div>
        </div>
      </header>

      {/* PAGE */}
      <main className={location.pathname === "/" ? "h-[calc(100svh-5rem)] w-full overflow-hidden" : "mx-auto w-full max-w-7xl flex-1 px-3 py-4 pb-28 sm:px-6 sm:py-6 sm:pb-8"}>
        {children}
      </main>

      {/* MOBILE FLOATING NAV */}
      <div className="fixed inset-x-0 bottom-4 z-200 px-2 sm:hidden">
        <nav className="mx-auto flex max-w-sm items-center justify-around rounded-[2rem] border border-primary/20 bg-background/90 p-2 shadow-2xl shadow-primary/20 backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-w-[55px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />

                <span className="text-xs font-bold">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* FOOTER */}
      <footer className={`${location.pathname === "/" ? "hidden" : "hidden sm:block"} border-t border-primary/10 bg-background/60 px-6 py-5 text-center`}>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          <p>
            Built for overplanners, airport lovers, and vacation spreadsheet
            enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  )
}
