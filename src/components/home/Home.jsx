import { Link } from "react-router-dom"
import {
  CalendarCheck,
  Compass,
  Luggage,
  MapPinned,
  PlaneTakeoff,
  Sparkles,
} from "lucide-react"
import { TravelMap } from "./TravelMap"

const launchSteps = [
  {
    icon: MapPinned,
    label: "Pick the route",
    detail: "Sketch where the trip starts, turns, and lands.",
  },
  {
    icon: CalendarCheck,
    label: "Stack the days",
    detail: "Turn loose ideas into leg-by-leg itinerary blocks.",
  },
  {
    icon: Luggage,
    label: "Pack the plan",
    detail: "Keep the details close when departure gets real.",
  },
]

export const Home = () => {
  return (
    <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="overflow-hidden rounded-lg border border-primary/20 bg-background shadow-sm shadow-primary/10">
        <div className="relative min-h-[28rem] bg-primary/10 p-6 sm:p-8">
          <div className="absolute top-8 right-8 hidden size-32 rounded-full border border-primary/20 bg-background/40 sm:block" />
          <div className="absolute right-12 bottom-8 hidden h-40 w-24 rounded-full border border-primary/15 bg-primary/10 sm:block" />

          <div className="relative max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              Trip launchpad
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Plan the trip, then let the details line themselves up.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Build trips in legs, collect the stops that matter, and turn
              scattered travel ideas into a timeline you can actually use.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/trips"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/85"
              >
                <PlaneTakeoff className="size-4" />
                Open trips
              </Link>
              <Link
                to="/trips"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/25 bg-background/70 px-4 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                <Compass className="size-4" />
                Start planning
              </Link>
            </div>
          </div>

          <div className="relative mt-10 rounded-lg border border-primary/20 bg-background/80 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">
                Departure board
              </p>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                Ready
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {launchSteps.map((step, index) => {
                const Icon = step.icon

                return (
                  <div
                    key={step.label}
                    className="relative rounded-lg border border-primary/15 bg-primary/5 p-4"
                  >
                    {index < launchSteps.length - 1 && (
                      <div className="absolute top-8 left-8 hidden h-px w-[calc(100%+0.75rem)] bg-primary/25 sm:block" />
                    )}
                    <div className="relative mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/25">
                      <Icon className="size-5" />
                    </div>
                    <p className="font-semibold">{step.label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <aside className="grid gap-4">
        <div className="rounded-lg border border-primary/20 bg-background p-5 shadow-sm shadow-primary/5">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <PlaneTakeoff className="size-5" />
          </div>
          <p className="text-sm font-semibold text-primary">
            Today&apos;s mode
          </p>
          <h2 className="mt-2 text-2xl font-bold">Build the next escape.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            A good trip starts messy. This app gives the mess a place to become
            dates, legs, stops, and a plan.
          </p>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
          <p className="text-sm font-semibold text-primary">Quick jump</p>
          <div className="mt-4 grid gap-3">
            <Link
              to="/trips"
              className="rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              View all trips
            </Link>
            <Link
              to="/trips"
              className="rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              Add a new adventure
            </Link>
          </div>
        </div>
      </aside>

      <TravelMap />
    </div>
  )
}
