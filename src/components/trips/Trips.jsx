import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { UpsertTrip } from "./UpsertTrip"
import {
  CalendarDays,
  CircleDollarSign,
  Compass,
  MapPin,
  Plane,
  Plus,
  Stamp,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"

const formatDate = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getTripDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "Dates TBD"

  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1)

  return `${days} ${days === 1 ? "day" : "days"}`
}

const getStartDateTime = (trip) => {
  if (!trip?.startDate) return Number.POSITIVE_INFINITY

  const time = new Date(trip.startDate).getTime()
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
}

const getTotalBudget = (trips = []) => {
  return trips.reduce((total, trip) => total + (trip.estimatedBudget ?? 0), 0)
}

const TripStat = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border border-primary/15 bg-background/85 p-4 shadow-sm shadow-primary/5">
    <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
      <Icon className="size-4" />
    </div>
    <p className="text-2xl leading-none font-bold">{value}</p>
    <p className="mt-1 text-sm text-muted-foreground">{label}</p>
  </div>
)

export const Trips = () => {
  const navigate = useNavigate()
  const { isPending, isError, data: trips, error } = useGetTrips()
  const sortedTrips = [...(trips ?? [])].sort(
    (firstTrip, secondTrip) =>
      getStartDateTime(firstTrip) - getStartDateTime(secondTrip)
  )
  const tripCount = sortedTrips.length
  const totalBudget = getTotalBudget(sortedTrips)
  const nextTrip = sortedTrips[0]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-7">
      <section className="overflow-hidden rounded-lg border border-primary/20 bg-background shadow-sm shadow-primary/10">
        <div className="relative bg-primary/10 p-6 sm:p-8">
          {/* <div className="absolute top-6 right-6 hidden size-24 rounded-full border border-primary/20 bg-primary/10 sm:block" /> */}
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end justify-between w-full">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Trips
              </h1>

            <UpsertTrip
              triggerHtml={
                <Button style={{ width: "max-content" }} className="!w-max inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/85">
                  <Plus className="size-4" />
                  New trip
                </Button>
              }
            />
          </div>
        </div>

        <div className="grid gap-3 border-t border-primary/15 bg-primary/5 p-4 sm:grid-cols-3">
          <TripStat icon={Plane} label="planned trips" value={tripCount} />
          <TripStat
            icon={CircleDollarSign}
            label="estimated budget"
            value={totalBudget ? `$${totalBudget.toLocaleString()}` : "$0"}
          />
          <TripStat
            icon={CalendarDays}
            label="next departure"
            value={nextTrip ? formatDate(nextTrip.startDate) : "TBD"}
          />
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTrips.map((trip, index) => {
            const hasImage = !!trip.coverPhotoSasUrl
            const location = trip.location || "Location TBD"
            const locationTextSize =
              location.length > 20
                ? "text-3xl sm:text-4xl"
                : location.length > 10
                  ? "text-4xl sm:text-5xl"
                  : "text-5xl sm:text-6xl"
            const dateRange =
              trip.startDate || trip.endDate
                ? `${formatDate(trip.startDate) || "TBD"} - ${formatDate(trip.endDate) || "TBD"}`
                : "Dates TBD"

            return (
              <button
                key={trip.tripID}
                type="button"
                className="group relative aspect-[4/3] min-h-72 overflow-hidden rounded-lg border border-white bg-primary/10 text-left shadow-md shadow-primary/10 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/15 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                onClick={() => navigate(`/trip?id=${trip.tripID}`)}
                aria-label={`View ${trip.name}`}
              >
                {hasImage && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${trip.coverPhotoSasUrl})`,
                    }}
                  />
                )}

                {!hasImage && (
                  <div className="absolute inset-0 bg-primary/20 [background-image:radial-gradient(circle_at_24%_18%,var(--primary)_0,transparent_34%),linear-gradient(135deg,var(--muted),var(--background))]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                <div className="absolute inset-0 border-[10px] border-white/90 shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.45)]" />

                <div className="absolute top-4 right-4 w-28 border border-white/70 bg-white/85 p-2 text-center text-[0.66rem] font-bold tracking-[0.08em] text-primary shadow-sm backdrop-blur-sm">
                  <div className="mb-1 flex items-center justify-center gap-1 border-b border-primary/25 pb-1 uppercase">
                    <Stamp className="size-3" />
                    Dates
                  </div>
                  <div className="leading-tight text-foreground">
                    {dateRange}
                  </div>
                </div>

                <div className="absolute right-5 bottom-5 left-5 text-white drop-shadow-[0_2px_8px_rgb(0_0_0_/_0.65)]">
                  <p
                    className={`flex items-center gap-2 leading-none font-normal text-white ${locationTextSize}`}
                  >
                    {/* <MapPin className="size-5 shrink-0" /> */}
                    <span className="font-[Yesteryear,cursive]">
                      {location}
                    </span>
                  </p>
                  <h2 className="mt-2 line-clamp-2 text-lg leading-tight font-semibold tracking-normal text-white/85">
                    {trip.name}
                  </h2>
                  <p className="mt-2 text-xs font-medium text-white/80">
                    Trip {index + 1} -{" "}
                    {getTripDuration(trip.startDate, trip.endDate)}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
