import { Link } from "react-router-dom"
import { MapPinned, PlaneTakeoff, Plus } from "lucide-react"
import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { TravelMap } from "./TravelMap"

export const Home = () => {
  const { isPending, isError, data: trips = [] } = useGetTrips()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingTrips = trips.filter((trip) => trip.startDate && new Date(trip.startDate) >= today).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  const nextTrip = upcomingTrips[0]
  const nextDestination = nextTrip?.destinations?.[0]?.city ?? nextTrip?.location ?? nextTrip?.name ?? "your next escape"

  return (
    <div className="h-[calc(100svh-5rem)] w-full overflow-hidden">
      <section className="relative isolate h-[calc(100svh-5rem)] min-h-[34rem] overflow-hidden border-y border-primary/20 bg-slate-950 shadow-2xl shadow-primary/15">
        <TravelMap trips={trips} isPending={isPending} isError={isError} />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] bg-gradient-to-b from-slate-950/85 via-slate-950/25 to-transparent p-4 sm:p-6">
          <div className="pointer-events-auto flex items-start justify-between gap-3">
            <div className="max-w-lg text-white drop-shadow-md">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/80"><MapPinned className="size-4" /> Your travel atlas</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Every trip starts with a pin.</h1>
              <p className="mt-2 hidden text-sm leading-6 text-white/80 sm:block">Explore your past and upcoming adventures, then zoom into the details.</p>
            </div>
            <Link to="/trips" className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-primary/90"><Plus className="size-4" /><span className="hidden sm:inline">Plan a trip</span><span className="sm:hidden">Plan</span></Link>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 pt-16 sm:p-6 sm:pt-24">
          <div className="pointer-events-auto grid grid-cols-3 gap-2 sm:max-w-2xl sm:gap-3">
            <div className="rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white backdrop-blur-md"><p className="text-xs font-bold uppercase tracking-wide text-white/60">Trips logged</p><p className="mt-1 text-2xl font-black">{isPending ? "—" : trips.length}</p></div>
            <div className="rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white backdrop-blur-md"><p className="text-xs font-bold uppercase tracking-wide text-white/60">Upcoming</p><p className="mt-1 text-2xl font-black">{isPending ? "—" : upcomingTrips.length}</p></div>
            <Link to="/trips" className="group rounded-2xl border border-primary/45 bg-primary/90 px-4 py-3 text-primary-foreground shadow-lg transition hover:bg-primary"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/75"><PlaneTakeoff className="size-3.5" /> Next up</p><p className="mt-1 truncate text-lg font-black group-hover:underline">{nextDestination}</p></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
