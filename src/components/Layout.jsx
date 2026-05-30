import { Link, useLocation } from "react-router-dom"
import {
  Home,
  PlaneTakeoff,
  Sparkles,
  MapPinned,
  NotebookPen,
  ChartColumnBig,
  Goal,
  Calendar
} from "lucide-react"

export const Layout = ({ children }) => {
  const location = useLocation()

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
    {
        to: "/goals",
        label: "Bucket List",
        icon: Goal,
    },
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

            <div className="ml-2 hidden items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-2 text-xs font-bold text-primary lg:flex">
              <Sparkles className="size-3.5" />
              Vacation mode enabled
            </div>
          </nav>
        </div>
      </header>

      {/* PAGE */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 pb-28 sm:px-6 sm:py-6 sm:pb-8">
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
      <footer className="hidden border-t border-primary/10 bg-background/60 px-6 py-5 text-center sm:block">
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