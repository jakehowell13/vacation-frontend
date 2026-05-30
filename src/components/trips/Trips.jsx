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
import { Postcard } from "./Postcard"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useUser } from "@/providers/UserProvider"

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
  const { user } = useUser();
  const navigate = useNavigate()
  const { isPending, isError, data: trips, error } = useGetTrips(user);
  const sortedTrips = [...(trips ?? [])].sort(
    (firstTrip, secondTrip) =>
      getStartDateTime(secondTrip) - getStartDateTime(firstTrip)
  )
  const tripCount = sortedTrips.length
  const totalBudget = getTotalBudget(sortedTrips)
  const nextTrip = sortedTrips[0]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-7">
      <section className="overflow-hidden rounded-lg border border-primary/20 bg-background shadow-sm shadow-primary/10">
        <div className="relative bg-primary/10 p-6 sm:p-8">
          {/* <div className="absolute top-6 right-6 hidden size-24 rounded-full border border-primary/20 bg-primary/10 sm:block" /> */}
          <div className="relative flex gap-5 flex-row justify-between w-full">
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

        <Accordion
              type="single"
              collapsible
              defaultValue="shipping"
              className="w-full"
            >
              <AccordionItem value="shipping" className="border border-primary/15 rounded-lg min-w-full">
                <AccordionTrigger>Trips Summary</AccordionTrigger>
                <AccordionContent className="h-max grid gap-3 border-t border-primary/15 bg-primary/5 p-4 sm:grid-cols-3">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        
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
          {sortedTrips?.map((trip, index) => (
            <Postcard key={trip.tripID} trip={trip} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
