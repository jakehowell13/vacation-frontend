import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useGetTrip } from "@/hooks/trips/useGetTrip";
import { useSearchParamManager } from "@/hooks/useSearchParamManager";
import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Route,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { UpsertTrip } from "./UpsertTrip";
import { UpsertTripCoverImage } from "./UpsertTripCoverImage";
import { UpsertItineraryItem } from "../itineraryItem/UpsertItineraryItem";
import { UpsertToDo } from "../to-do/UpsertToDo";
import { UpsertLeg } from "../legs/UpsertLeg";

const formatDate = (dateString) => {
  if (!dateString) return "Date TBD";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

const formatTime = (dateString) => {
  if (!dateString) return null;

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const formatTimeRange = (startDateTime, endDateTime) => {
  const start = formatTime(startDateTime);
  const end = formatTime(endDateTime);

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return `Ends ${end}`;
  return "Time TBD";
};

const getSortedItineraryItems = (items = []) => {
  return [...items].sort((a, b) => {
    if (!a.startDateTime && !b.startDateTime) {
      return a.name.localeCompare(b.name);
    }

    if (!a.startDateTime) return 1;
    if (!b.startDateTime) return -1;

    return new Date(a.startDateTime) - new Date(b.startDateTime);
  });
};

const getOverallItineraryItems = (legs = []) => {
  return legs.flatMap((leg) =>
    (leg.itineraryItems ?? []).map((item) => ({
      ...item,
      legName: leg.name,
      legLocation: leg.location,
    }))
  );
};

const TripSummaryItem = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 items-center gap-3 rounded-lg border border-primary/15 bg-background px-4 py-3 shadow-sm shadow-primary/5">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
      <Icon className="size-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="truncate text-sm font-semibold">{value}</p>
    </div>
  </div>
);

const ItineraryTimeline = ({ items, showLegCallout = false, emptyMessage, trip }) => {
  const sortedItems = getSortedItineraryItems(items);

  if (sortedItems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-primary/30 bg-primary/10 p-8 text-center">
        <p className="font-medium">No itinerary items yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {emptyMessage ??
            "Add activities, meals, lodging, or travel details for this leg."}
        </p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-5 border-l border-primary/30 pl-6">
      {sortedItems.map((item) => (
        <li key={item.itineraryItemID} className="group relative">
          <span className="absolute -left-[31px] top-1 flex size-3 rounded-full border-2 border-background bg-primary shadow-sm shadow-primary/50" />

          <div className="relative rounded-lg border border-primary/15 bg-background p-4 shadow-sm shadow-primary/5">
            
            {/* Smooth Edit Button */}
            <button
              className="absolute right-3 bottom-3 
                        opacity-0 scale-95 -translate-y-1
                        transition-all duration-200 ease-out
                        h-10 w-10 flex items-center justify-center
                        group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
                        rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20"
            > 
              <UpsertItineraryItem trip={trip} itineraryItem={item} triggerHtml={<Pencil className="size-4" />} />
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {item.itineraryTypeName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {formatDate(item.startDateTime ?? item.endDateTime)}
                  </span>
                  {showLegCallout && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <MapPin className="size-3.5" />
                      {item.legName}
                      {item.legLocation ? `, ${item.legLocation}` : ""}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold">{item.name}</h3>
                {item.description && (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <Clock3 className="size-4 text-primary" />
                {formatTimeRange(item.startDateTime, item.endDateTime)}
              </div>
            </div>
          </div>
        </li>
      ))}
      <li className="relative">
          <span className="absolute -left-[31px] top-1 flex size-3 rounded-full border-2 border-background bg-primary shadow-sm shadow-primary/50" />
          <div className="rounded-lg border border-primary/15 bg-background p-4 shadow-sm shadow-primary/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <UpsertItineraryItem trip={trip} />
              </div>
            </div>
          </div>
        </li>
    </ol>
  );
};

const ToDoList = ({ toDos = [], trip }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  const filtered = toDos.filter(
    (t) => showCompleted || !t.isCompleted
  );

  return (
    <div className="rounded-xl border border-primary/15 bg-background p-4 shadow-sm shadow-primary/5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">To Do</h2>
          <p className="text-xs text-muted-foreground">
            {toDos.length} items •{" "}
            {toDos.filter((t) => t.isCompleted).length} completed
          </p>
        </div>

        <div className=" flex flex-col gap-2">
        <UpsertToDo trip={trip} />
        <button
          onClick={() => setShowCompleted((prev) => !prev)}
          className="text-xs text-primary hover:underline"
        >
          {showCompleted ? "Hide completed" : "Show completed"}
        </button>  
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          No tasks to show
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((todo) => (
            <li
              key={todo.toDoID}
              className="flex items-start gap-3 rounded-lg border border-primary/10 p-3"
            >
              {todo.isCompleted ? (
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
              ) : (
                <Circle className="mt-0.5 size-4 text-muted-foreground" />
              )}

              <p
                className={`text-sm ${
                  todo.isCompleted
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {todo.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const Trip = () => {
  const { searchParams } = useSearchParamManager();
  const id = searchParams.get("id");

  const { isPending, isError, data: trip, error, refetch } = useGetTrip(id);
  const legs = trip?.legs ?? [];
  const overallItineraryItems = getOverallItineraryItems(legs);

  if (!id) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">No trip selected</p>
      </div>
    );
  }

  if (isPending) {
    return <div className="h-80 animate-pulse rounded-lg bg-muted" />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <p className="font-semibold text-destructive">
          Unable to load this trip.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {error?.message ?? "Please try again."}
        </p>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">

      {/* HERO */}
      <section className="group relative min-h-[260px] overflow-hidden rounded-xl border border-primary/15 shadow-sm shadow-primary/10">
        {trip.coverPhotoSasUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${trip.coverPhotoSasUrl})` }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20" />

        <div className="relative flex h-full flex-col justify-between gap-6 p-6 lg:flex-row lg:items-end">
          <div className="text-white">
            <h1 className="text-4xl font-semibold">{trip.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-white/80">
              <MapPin className="size-4" />
              {trip.location}
            </p>
          </div>

          <div className="flex gap-2">
            <UpsertTripCoverImage trip={trip} />
            <UpsertTrip trip={trip} refetch={refetch} triggerHtml={<div className="bg-white px-3 py-1.5 text-black rounded-md">Edit</div>} />
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <TripSummaryItem icon={CalendarDays} label="Starts" value={formatDate(trip.startDate)} />
        <TripSummaryItem icon={CalendarDays} label="Ends" value={formatDate(trip.endDate)} />
        <TripSummaryItem icon={CircleDollarSign} label="Budget" value={trip.estimatedBudget ? `$${trip.estimatedBudget.toLocaleString()}` : "Budget TBD"} />
        <TripSummaryItem icon={CircleDollarSign} label="Cost" value={trip.cost ? `$${trip.cost.toLocaleString()}` : "Cost TBD"} />
        <TripSummaryItem icon={Route} label="Itinerary" value={`${overallItineraryItems.length} items`} />
        <TripSummaryItem icon={Route} label="Legs" value={`${legs.length} legs`} />
      </section>

      {/* TIMELINE + TODOS */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overall">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <TabsList className="flex h-auto flex-wrap justify-start">
                <TabsTrigger value="overall">Overall</TabsTrigger>
                {legs.map((leg) => (
                  <TabsTrigger key={leg.legID} value={leg.legID}>
                    {leg.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <UpsertLeg
                trip={trip}
                refetch={refetch}
                triggerHtml={
                  <Button size="sm" className="gap-2">
                    <Plus className="size-4" />
                    Add Leg
                  </Button>
                }
              />
            </div>

            <TabsContent value="overall">
              <ItineraryTimeline trip={trip} items={overallItineraryItems} showLegCallout />
            </TabsContent>

            {legs.map((leg) => (
              <TabsContent key={leg.legID} value={leg.legID}>
                <div className="mb-4 flex flex-col gap-3 rounded-lg border border-primary/15 bg-background p-4 shadow-sm shadow-primary/5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold">{leg.name}</h2>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4" />
                      {leg.location || "Location TBD"}
                    </p>
                  </div>
                  <UpsertLeg
                    leg={leg}
                    trip={trip}
                    refetch={refetch}
                    triggerHtml={
                      <Button variant="outline" size="sm" className="gap-2">
                        <Pencil className="size-4" />
                        Edit Leg
                      </Button>
                    }
                  />
                </div>
                <ItineraryTimeline trip={trip} items={leg.itineraryItems ?? []} />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="lg:col-span-1 lg:sticky lg:top-6 h-fit">
          <ToDoList toDos={trip.toDos ?? []} trip={trip} />
        </div>
      </div>
    </div>
  );
};
