import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { PlaneTakeoff } from "lucide-react"

export const NextTrip = () => {

    const { isPending, isError, data: trips } = useGetTrips();
    const nextTrip = [...(trips ?? [])].filter((trip) => trip.startDate >= new Date()).sort((a, b) => {
        const aTime = new Date(a.startDate).getTime();
        const bTime = new Date(b.startDate).getTime();
        return aTime - bTime;
    })[0];
    

    return (
        !!nextTrip ? (
            <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <PlaneTakeoff className="size-5" />
                </div>
                <h2 className="mt-2 text-2xl font-bold">Next trip: {nextTrip.name}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {nextTrip.estimatedBudget ? `Estimated budget: $${nextTrip.estimatedBudget}` : "No budget set."}
                </p>
            </div>
        ) : (
        (<div className="rounded-lg border border-primary/20 bg-background p-5 shadow-sm shadow-primary/5">
            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <PlaneTakeoff className="size-5" />
            </div>
            <h2 className="mt-2 text-2xl font-bold">WTF? You have nothing planned?</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
            That's unlike you. Let&apos;s change that. Add a new adventure by clicking the button below.
            </p>
        </div>)
    ))
}