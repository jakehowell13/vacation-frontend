import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { UpsertTrip } from "./UpsertTrip"
import { CalendarDays, History, Plane, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Postcard } from "./Postcard"
import { useState } from "react"

const formatDate = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getStartDateTime = (trip) => {
  if (!trip?.startDate) return Number.POSITIVE_INFINITY

  const time = new Date(trip.startDate).getTime()
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
}

const getTotalBudget = (trips = []) => {
  return trips.reduce((total, trip) => total + (trip.estimatedBudget ?? 0), 0)
}

export const Trips = () => {
  const [expandedYears, setExpandedYears] = useState([])
  const { isPending, isError, data: trips, error } = useGetTrips();
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingTrips = (trips ?? []).filter((trip) => !trip.endDate || new Date(trip.endDate) >= today).sort((firstTrip, secondTrip) => getStartDateTime(firstTrip) - getStartDateTime(secondTrip))
  const previousTrips = (trips ?? []).filter((trip) => trip.endDate && new Date(trip.endDate) < today).sort((firstTrip, secondTrip) => getStartDateTime(secondTrip) - getStartDateTime(firstTrip))
  const previousTripsByYear = previousTrips.reduce((groups, trip) => {
    const year = new Date(trip.endDate ?? trip.startDate).getFullYear()
    groups[year] ??= []
    groups[year].push(trip)
    return groups
  }, {})
  const tripCount = upcomingTrips.length + previousTrips.length
  const totalBudget = getTotalBudget([...upcomingTrips, ...previousTrips])
  const nextTrip = upcomingTrips[0]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-7">
      <section className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-background px-4 py-4 shadow-sm shadow-primary/5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Trips</h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{tripCount} planned</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Your travel plans, all in one place.</p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="hidden items-center gap-4 text-right sm:flex">
            <div><p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">Budget</p><p className="text-sm font-black">{totalBudget ? `$${totalBudget.toLocaleString()}` : "$0"}</p></div>
            <div><p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">Next</p><p className="text-sm font-black">{nextTrip ? formatDate(nextTrip.startDate) : "TBD"}</p></div>
          </div>
          <UpsertTrip triggerHtml={<Button style={{ width: "max-content" }} className="!w-max inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/85"><Plus className="size-4" />New trip</Button>} />
        </div>
      </section>

      {isPending && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-lg border border-primary/10 bg-primary/10"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <p className="font-semibold text-destructive">
            Unable to load trips.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error?.message ?? "Unknown error"}
          </p>
        </div>
      )}

      {!isPending && !isError && tripCount === 0 && (
        <div className="rounded-lg border border-dashed border-primary/30 bg-primary/10 p-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Plane className="size-6" />
          </div>
          <p className="text-lg font-semibold">No trips found yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Create your first trip and this board will turn into your planning
            command center.
          </p>
        </div>
      )}

      {!isPending && !isError && tripCount > 0 && (
        <div className="flex flex-col gap-10">
          {upcomingTrips.length > 0 && <section>
            <div className="mb-4 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><CalendarDays className="size-4" /></div><div><h2 className="font-black">Upcoming</h2><p className="text-sm text-muted-foreground">{upcomingTrips.length} trip{upcomingTrips.length === 1 ? "" : "s"} on the horizon</p></div><div className="h-px flex-1 bg-primary/15" /></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{upcomingTrips.map((trip, index) => <Postcard key={trip.tripID} trip={trip} index={index} />)}</div>
          </section>}
          {previousTrips.length > 0 && <section>
            <div className="mb-6 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground"><History className="size-4" /></div><div><h2 className="font-black">Previous</h2><p className="text-sm text-muted-foreground">Trips you&apos;ve already conquered</p></div><div className="h-px flex-1 bg-primary/15" /></div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(previousTripsByYear).sort(([firstYear], [secondYear]) => Number(secondYear) - Number(firstYear)).map(([year, yearTrips]) => {
                const isExpanded = expandedYears.includes(year)
                const collageTrips = Array.from({ length: 9 }, (_, index) => yearTrips[index % yearTrips.length])

                return <section key={year} className={`relative ${isExpanded ? "sm:col-span-2 xl:col-span-3" : ""}`}>
                  <button type="button" onClick={() => setExpandedYears((years) => years.includes(year) ? years.filter((item) => item !== year) : [...years, year])} aria-expanded={isExpanded} className={`group relative w-full overflow-hidden rounded-[2rem] border border-primary/15 bg-slate-900 text-left shadow-xl shadow-primary/10 transition hover:-translate-y-0.5 hover:shadow-2xl ${isExpanded ? "aspect-[16/9] sm:aspect-[2.5/1]" : "aspect-[4/3]"}`}>
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 bg-slate-950 p-1">
                      {collageTrips.map((trip, index) => <div key={`${trip.tripID}-${index}`} className="relative overflow-hidden border-[5px] border-white bg-primary/40 shadow-md" style={{ transform: `scale(1.08) rotate(${[-3, 2, -1, 1, -2, 3][index % 6]}deg)` }}>
                        <div className="absolute inset-0 bg-cover bg-center" style={trip.coverPhotoSasUrl ? { backgroundImage: `url(${trip.coverPhotoSasUrl})` } : { background: [`linear-gradient(135deg,#172554,#2563eb)`, `linear-gradient(135deg,#4c1d95,#db2777)`, `linear-gradient(135deg,#134e4a,#14b8a6)`][index % 3] }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                        <p className="absolute bottom-1.5 left-2 right-2 truncate font-[Yesteryear,cursive] text-base leading-none text-white drop-shadow-md sm:text-xl">{trip.location || trip.name || "Adventure"}</p>
                      </div>)}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/45" />
                    <div className="absolute inset-0 grid place-items-center"><div className="text-center text-white drop-shadow-[0_4px_14px_rgb(0_0_0_/_0.55)]"><p className="text-lg font-black uppercase tracking-[0.22em] text-white/80 sm:text-xs sm:tracking-[0.35em]">Postcards from</p><p className="mt-0 text-9xl font-black tracking-[-0.1em] sm:mt-1 sm:text-8xl">{year}</p><p className="mt-1 text-xl font-bold text-white/90 sm:mt-3 sm:text-sm">{isExpanded ? "Hide collection" : `Open ${yearTrips.length} postcard${yearTrips.length === 1 ? "" : "s"}`}</p></div></div>
                  </button>
                  {isExpanded && <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{yearTrips.map((trip, index) => <div key={trip.tripID} className="transition-transform duration-300 hover:z-10 hover:scale-[1.03]" style={{ transform: `rotate(${[-2, 1.5, -1, 2][index % 4]}deg)` }}><Postcard trip={trip} index={index} /></div>)}</div>}
                </section>
              })}
            </div>
          </section>}
        </div>
      )}
    </div>
  )
}
