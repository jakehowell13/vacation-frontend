import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, PlaneTakeoff } from "lucide-react"
import { Button } from "@/components/ui/button"

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const colors = ["bg-primary text-primary-foreground", "bg-sky-600 text-white", "bg-violet-600 text-white", "bg-emerald-600 text-white", "bg-orange-500 text-white", "bg-rose-600 text-white"]
const toDate = (value) => { const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/); return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null }
const dayStart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date, days) => { const next = new Date(date); next.setDate(next.getDate() + days); return next }
const monthDays = (date) => { const first = new Date(date.getFullYear(), date.getMonth(), 1); const start = addDays(first, -first.getDay()); return Array.from({ length: 42 }, (_, index) => addDays(start, index)) }
const weekDaysFrom = (date) => { const start = addDays(date, -date.getDay()); return Array.from({ length: 7 }, (_, index) => addDays(start, index)) }
const hours = Array.from({ length: 24 }, (_, index) => index)
const hourLabel = (hour) => hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`

const ViewTabs = ({ view, onChange, className = "" }) => <div className={`inline-flex rounded-xl border border-primary/15 bg-background/90 p-1 shadow-lg backdrop-blur ${className}`}>{["month", "week", "day"].map((item) => <button key={item} type="button" onClick={() => onChange(item)} className={`rounded-lg px-3 py-1.5 text-xs font-black capitalize transition ${view === item ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{item}</button>)}</div>

const DayCell = ({ day, trips, inMonth = true }) => {
  const isToday = dayStart(new Date()).getTime() === day.getTime()
  return <div className={`min-h-32 border-b border-r border-primary/10 p-1.5 sm:min-h-36 sm:p-2 ${inMonth ? "bg-background" : "bg-muted/30"}`}><div className="mb-1 flex justify-end"><span className={`grid size-6 place-items-center rounded-full text-xs font-bold ${isToday ? "bg-primary text-primary-foreground" : inMonth ? "text-foreground" : "text-muted-foreground"}`}>{day.getDate()}</span></div><div className="space-y-1">{trips.slice(0, 3).map((trip) => <Link key={trip.tripID ?? trip.id} to={`/trip?id=${trip.tripID ?? trip.id}`} className={`block truncate rounded-md px-1.5 py-1 text-[0.68rem] font-bold shadow-sm transition hover:brightness-110 sm:text-xs ${trip.color}`} title={trip.name}>{trip.name}</Link>)}{trips.length > 3 && <p className="px-1 text-[0.65rem] font-bold text-primary">+{trips.length - 3} more</p>}</div></div>
}

const WeekView = ({ days, tripsForDay }) => {
  const eventsForDay = (day) => {
    const dayTrips = tripsForDay(day)
    return dayTrips.flatMap((trip) => {
      const items = [...(trip.itineraryItems ?? []), ...(trip.legs ?? []).flatMap((leg) => leg.itineraryItems ?? [])].filter((item) => {
        const itemDate = toDate(item.startDateTime)
        return itemDate && itemDate.getTime() === day.getTime()
      })
      if (!items.length) return [{ id: `${trip.tripID ?? trip.id}-${day.toISOString()}-all-day`, trip, allDay: true, name: trip.name }]
      return items.map((item, index) => ({ id: item.itineraryItemID ?? item.id ?? `${trip.tripID}-${index}`, trip, name: item.name ?? "Itinerary item", start: new Date(item.startDateTime), end: item.endDateTime ? new Date(item.endDateTime) : new Date(new Date(item.startDateTime).getTime() + 60 * 60 * 1000) }))
    })
  }
  const eventStyle = (event) => {
    const minutes = event.start.getHours() * 60 + event.start.getMinutes()
    const duration = Math.max((event.end - event.start) / 60000, 30)
    return { top: `${(minutes / 60) * 48}px`, height: `${Math.max((duration / 60) * 48, 28)}px` }
  }
  return <div className="overflow-x-auto"><div className="min-w-[98rem] p-3 sm:p-5"><div className="grid" style={{ gridTemplateColumns: "72px repeat(7, 13rem)" }}><div className="sticky top-0 z-20 border-b bg-background" />{days.map((day) => <div key={day.toISOString()} className="sticky top-0 z-20 border-b border-l bg-background p-3 text-center"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{day.toLocaleDateString(undefined, { weekday: "short" })}</p><p className="mt-1 text-xl font-black">{day.getDate()}</p><div className="mt-2 space-y-1">{eventsForDay(day).filter((event) => event.allDay).map((event) => <Link key={event.id} to={`/trip?id=${event.trip.tripID ?? event.trip.id}`} className={`block truncate rounded-md px-2 py-1 text-xs font-bold ${event.trip.color}`}>{event.name}</Link>)}</div></div>)}<div>{hours.map((hour) => <div key={hour} className="border-b pr-2 text-right text-xs text-muted-foreground" style={{ height: 48 }}>{hourLabel(hour)}</div>)}</div>{days.map((day) => <div key={day.toISOString()} className="relative border-l" style={{ height: hours.length * 48 }}>{hours.map((hour) => <div key={hour} className="border-b" style={{ height: 48 }} />)}{eventsForDay(day).filter((event) => !event.allDay).map((event) => <Link key={event.id} to={`/trip?id=${event.trip.tripID ?? event.trip.id}`} style={eventStyle(event)} className={`absolute left-1 right-1 overflow-hidden rounded-md px-2 py-1 text-xs font-bold shadow-sm ${event.trip.color}`}><span className="block truncate">{event.name}</span><span className="block truncate text-[0.65rem] opacity-75">{event.trip.name}</span></Link>)}</div>)}</div></div></div>
}

export const TripCalendar = ({ trips = [] }) => {
  const [view, setView] = useState("month")
  const [cursor, setCursor] = useState(() => dayStart(new Date()))
  const datedTrips = useMemo(() => trips.map((trip, index) => { const start = toDate(trip.startDate); const end = toDate(trip.endDate) ?? start; return start && end ? { ...trip, start: dayStart(start), end: dayStart(end), color: colors[index % colors.length] } : null }).filter(Boolean), [trips])
  const tripsForDay = (day) => datedTrips.filter((trip) => day >= trip.start && day <= trip.end)
  const visibleDays = view === "month" ? monthDays(cursor) : view === "week" ? weekDaysFrom(cursor) : [cursor]
  const title = view === "month" ? cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" }) : view === "week" ? `${visibleDays[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${visibleDays[6].toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}` : cursor.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  const move = (direction) => setCursor((date) => view === "month" ? new Date(date.getFullYear(), date.getMonth() + direction, 1) : addDays(date, direction * (view === "week" ? 7 : 1)))
  const reset = () => setCursor(dayStart(new Date()))

  return <section className="overflow-hidden rounded-[2rem] border border-primary/15 bg-background shadow-sm shadow-primary/5">
    <header className="flex flex-col gap-4 border-b border-primary/10 p-5 sm:p-6"><div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary"><PlaneTakeoff className="size-4" /> Travel calendar</p><h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{view === "month" ? "A month at a glance for every trip." : view === "week" ? "Your travel plans across the week." : "Everything planned for this day."}</p></div><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => move(-1)} aria-label={`Previous ${view}`}><ChevronLeft className="size-4" /></Button><Button variant="outline" onClick={reset}>Today</Button><Button variant="outline" size="icon" onClick={() => move(1)} aria-label={`Next ${view}`}><ChevronRight className="size-4" /></Button></div><ViewTabs view={view} onChange={setView} /></div></header>
    {view === "day" ? <div className="p-5 sm:p-6">{tripsForDay(cursor).length ? <div className="grid gap-3 sm:grid-cols-2">{tripsForDay(cursor).map((trip) => <Link key={trip.tripID ?? trip.id} to={`/trip?id=${trip.tripID ?? trip.id}`} className={`rounded-2xl p-5 text-white shadow-sm transition hover:-translate-y-0.5 ${trip.color}`}><p className="text-xs font-black uppercase tracking-[0.16em] text-white/75">Traveling today</p><h2 className="mt-2 text-xl font-black">{trip.name}</h2><p className="mt-1 text-sm text-white/80">{trip.location || "Location TBD"}</p></Link>)}</div> : <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/[0.03] p-10 text-center"><p className="font-bold">No trips on this day.</p><p className="mt-1 text-sm text-muted-foreground">Choose another day or start planning your next escape.</p></div>}</div> : view === "week" ? <WeekView days={visibleDays} tripsForDay={tripsForDay} /> : <div className="overflow-x-auto"><div className="w-full min-w-0 p-0 sm:min-w-[44rem] sm:p-5"><div className="grid grid-cols-7 border-l border-t border-primary/10">{weekDays.map((day) => <div key={day} className="border-b border-r border-primary/10 bg-primary/[0.03] px-1 py-2 text-center text-[0.65rem] font-black uppercase tracking-wide text-muted-foreground sm:px-2 sm:text-xs">{day}</div>)}{visibleDays.map((day) => <DayCell key={day.toISOString()} day={day} trips={tripsForDay(day)} inMonth={day.getMonth() === cursor.getMonth()} />)}</div></div></div>}
  </section>
}
