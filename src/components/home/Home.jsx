import { Link } from "react-router-dom"
import {
  Compass,
  Globe2,
  MapPinned,
  PlaneTakeoff,
  Rocket,
  Sparkles,
  Stars,
  Ticket,
} from "lucide-react"

import { useGetTrips } from "@/hooks/trips/useGetTrips"

import { TravelMap } from "./TravelMap"
import { NextTrip } from "./NextTrip"

const missionCards = [
  {
    icon: MapPinned,
    title: "Plot the mission",
    detail:
      "Drop pins, map routes, and pretend you're definitely not overplanning.",
  },
  {
    icon: Ticket,
    title: "Lock the itinerary",
    detail:
      "Flights, hotels, food stops, chaos. Keep it all in one place.",
  },
  {
    icon: Rocket,
    title: "Launch vacation mode",
    detail:
      "Mentally clock out weeks before takeoff like a professional.",
  },
]

export const Home = () => {
  const { isPending, isError, data: trips } = useGetTrips()

  // Normalize today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  // Upcoming trips
  const upcoming = (trips ?? [])
    .filter((trip) => {
      const tripDate = new Date(trip.startDate)
      return tripDate.getTime() >= todayStart.getTime()
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    )

  const nextTrip = upcoming[0]

  // Personal stats
  const tripCount = trips?.length ?? 0

  const completedTrips = (trips ?? []).filter(
    (trip) =>
      new Date(trip.endDate).getTime() < todayStart.getTime()
  )

  const upcomingTrips = upcoming.length

  const nextDestination =
    nextTrip?.destinations?.[0]?.city ||
    nextTrip?.name ||
    "Somewhere fun"

  const randomTrip =
    trips && trips.length > 0
      ? trips[Math.floor(Math.random() * trips.length)]
      : null

  const randomTripName =
    randomTrip?.name ||
    randomTrip?.destinations?.[0]?.city ||
    "Future Adventure"

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-3 pb-10 sm:px-5 lg:gap-6 lg:px-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-background to-primary/5 shadow-xl shadow-primary/10">
        {/* Glow blobs */}
        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        {/* Floating sparkles */}
        <div className="absolute top-8 left-8 text-primary/40">
          <Stars className="size-4" />
        </div>

        <div className="absolute top-20 right-10 text-primary/30">
          <Sparkles className="size-5" />
        </div>

        <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:p-10">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-center">
            {/* <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary backdrop-blur">
              <Sparkles className="size-3.5" />
              Vacation Command Center
            </div> */}

            <h1 className="max-w-xl text-4xl font-black leading-none tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              You're Type-A?
              <span className="mt-2 block text-primary">
                That's A-Okay!
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Nothing beats a custom travel planning website built to your exact specifications.
              Let's build trips, organize itineraries, pin your adventures, and fully
              embrace your Type-A vacation commander era.
            </p>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row mb-4">
              <Link
                to="/trips"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <PlaneTakeoff className="size-4 transition-transform group-hover:translate-x-0.5" />
                Launch trip planning
              </Link>

              <Link
                to="/trips"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-background/80 px-5 text-sm font-bold text-foreground backdrop-blur transition-all hover:bg-primary/10"
              >
                <Compass className="size-4" />
                Open command center
              </Link>
            </div>

            {/* Mission cards */}
            {/* <div className="mt-7 grid gap-3">
              {missionCards.map((card) => {
                const Icon = card.icon

                return (
                  <div
                    key={card.title}
                    className="group flex items-start gap-4 rounded-2xl border border-primary/15 bg-background/70 p-4 backdrop-blur transition-all hover:border-primary/30 hover:bg-background"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:rotate-6">
                      <Icon className="size-5" />
                    </div>

                    <div>
                      <h3 className="font-black text-foreground">
                        {card.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {card.detail}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div> */}
            {/* NEXT TRIP */}
            <NextTrip nextTrip={nextTrip} />

            {/* MINI STATUS STRIP */}
            {/* <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Mode
                </p>

                <p className="mt-2 text-sm font-black">
                  Vacation
                </p>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </p>

                <p className="mt-2 text-sm font-black">
                  Packed
                </p>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Energy
                </p>

                <p className="mt-2 text-sm font-black">
                  ✈️
                </p>
              </div>
            </div> */}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-4">
            {/* COMMAND STATUS */}
            <div className="overflow-hidden rounded-[1.75rem] border border-primary/20 bg-background/80 shadow-xl shadow-primary/5 backdrop-blur">
              <div className="border-b border-primary/10 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      Vacation Command Center
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Systems fully operational
                    </h2>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Globe2 className="size-6" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-5">
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Trips Logged
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {isPending ? "--" : tripCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Upcoming
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {isPending ? "--" : upcomingTrips}
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Current mission
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-black">
                        Prepare for {nextDestination}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Vacation brain loading...
                      </p>
                    </div>

                    <PlaneTakeoff className="size-5 shrink-0 text-primary" />
                  </div>
                </div>

                <div className="col-span-2 rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Commander insight
                      </p>

                      <p className="mt-2 text-base font-black leading-6">
                        {completedTrips.length > 5
                          ? "You may actually have a permanent airport personality now."
                          : "Your passport is begging for more stamps."}
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Random mission on file: {randomTripName}
                      </p>
                    </div>

                    <Sparkles className="mt-1 size-5 shrink-0 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="overflow-hidden rounded-[2rem] border border-primary/20 bg-background shadow-xl shadow-primary/5">
        <div className="flex flex-col gap-3 border-b border-primary/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Flight log
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Places you've conquered
            </h2>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
            <MapPinned className="size-4" />
            Passport mode activated
          </div>
        </div>

        <div className="p-2 sm:p-3">
          <TravelMap />
        </div>
      </section>
    </div>
  )
}