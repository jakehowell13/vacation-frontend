import { useMemo, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const HOURS = Array.from({ length: 24 }, (_, i) => i)

const DAY_WIDTH = 220
const HOUR_HEIGHT = 40

const COLORS = [
  "bg-blue-500/90 border-blue-400",
  "bg-emerald-500/90 border-emerald-400",
  "bg-purple-500/90 border-purple-400",
  "bg-orange-500/90 border-orange-400",
  "bg-pink-500/90 border-pink-400",
  "bg-cyan-500/90 border-cyan-400",
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return isMobile
}

export const TripCalendar = ({ trips = [] }) => {
  const [weekOffset, setWeekOffset] = useState(0)
  const isMobile = useIsMobile()

  const visibleDaysCount = 7 // isMobile ? 3 : 

  /**
   * 🔥 Normalize ALL events:
   * - trip.itineraryItems
   * - trip.legs[].itineraryItems
   */
  const events = useMemo(() => {
    let colorIndex = 0

    return trips.flatMap((trip) => {
      const tripColor = COLORS[colorIndex++ % COLORS.length]

      const tripEvents = (trip.itineraryItems ?? []).map((item) => ({
        ...item,
        tripId: trip.tripID,
        tripName: trip.name,
        source: "trip",
        legName: null,
        color: tripColor,
      }))

      const legEvents = (trip.legs ?? []).flatMap((leg) => {
        return (leg.itineraryItems ?? []).map((item) => ({
          ...item,
          tripId: trip.tripID,
          tripName: trip.name,
          legId: leg.legID,
          legName: leg.name,
          source: "leg",
          color: tripColor,
        }))
      })

      return [...tripEvents, ...legEvents]
    })
  }, [trips])

  const days = useMemo(() => {
    const today = new Date()

    const start = new Date(today)
    start.setDate(today.getDate() - today.getDay() + weekOffset * 7)
    start.setHours(0, 0, 0, 0)

    return Array.from({ length: visibleDaysCount }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [weekOffset, visibleDaysCount])

  const getEventsForDay = (date) => {
    return events.filter((event) => {
      if (!event.startDateTime) return false

      const d = new Date(event.startDateTime)

      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      )
    })
  }

  const getEventStyle = (event) => {
    const start = new Date(event.startDateTime)
    const end = new Date(event.endDateTime)

    const startMinutes = start.getHours() * 60 + start.getMinutes()
    const durationMinutes = (end - start) / 60000

    return {
      top: `${(startMinutes / 60) * HOUR_HEIGHT}px`,
      height: `${Math.max((durationMinutes / 60) * HOUR_HEIGHT, 28)}px`,
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="text-xl font-semibold">
            Travel Calendar
          </h2>
          <p className="text-sm text-muted-foreground">
            {isMobile ? "3-day view" : "7-day view"} • Trips + Legs
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekOffset((x) => x - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button variant="outline" onClick={() => setWeekOffset(0)}>
            Today
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekOffset((x) => x + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `80px repeat(${visibleDaysCount}, ${DAY_WIDTH}px)`,
            minWidth: `${80 + DAY_WIDTH * visibleDaysCount}px`,
          }}
        >
          {/* corner */}
          <div className="sticky top-0 z-30 border-b bg-background" />

          {/* day headers */}
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="sticky top-0 z-30 border-b border-l bg-background p-3 text-center"
            >
              <div className="text-sm text-muted-foreground">
                {day.toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </div>
              <div className="text-lg font-semibold">
                {day.getDate()}
              </div>
            </div>
          ))}

          {/* hours */}
          <div>
            {HOURS.map((h) => (
              <div
                key={h}
                className="border-b pr-2 text-right text-xs text-muted-foreground"
                style={{ height: HOUR_HEIGHT }}
              >
                {h === 0
                  ? "12 AM"
                  : h < 12
                  ? `${h} AM`
                  : h === 12
                  ? "12 PM"
                  : `${h - 12} PM`}
              </div>
            ))}
          </div>

          {/* day columns */}
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="relative border-l"
              style={{ height: HOURS.length * HOUR_HEIGHT }}
            >
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="border-b"
                  style={{ height: HOUR_HEIGHT }}
                />
              ))}

              {getEventsForDay(day).map((event) => (
                <div
                  key={event.itineraryItemID}
                  style={getEventStyle(event)}
                  className={`absolute left-1 right-1 rounded-md border p-2 text-white shadow transition hover:scale-[1.02] ${event.color}`}
                >
                  <div className="truncate text-sm font-semibold">
                    {event.name}
                  </div>

                  <div className="text-xs opacity-90">
                    {event.tripName}
                  </div>

                  {event.legName && (
                    <div className="text-xs opacity-75">
                      {event.legName}
                    </div>
                  )}

                  <div className="text-xs opacity-80">
                    {event.source === "leg" ? "Leg" : "Trip"}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}