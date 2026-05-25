import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { PlaneTakeoff } from "lucide-react"

export const NextTrip = () => {

    const { isPending, isError, data: trips } = useGetTrips();
    // Filter out past trips and pick the next upcoming trip (closest to today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const upcoming = (trips ?? []).filter((trip) => {
        const tripDate = new Date(trip.startDate);
        return tripDate.getTime() >= todayStart.getTime();
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const nextTrip = upcoming[0];
    
    console.log("NextTrip Component - Trips Data:", trips);         
    console.log("NextTrip Component - Next Trip:", nextTrip);

    return (
        nextTrip ? (            
            <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <PlaneTakeoff className="size-5" />
                </div>
                <h2 className="mt-2 text-2xl font-bold">Next trip: {nextTrip?.name}</h2>
                <p className="mt-1 text-md">
                    {nextTrip?.location ? `Location: ${nextTrip.location}` : "Location TBD"}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {nextTrip?.startDate ? `Starts on: ${new Date(nextTrip.startDate).toLocaleDateString()}` : "Start date TBD"}
                </p>
                 <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {nextTrip?.endDate ? `Ends on: ${new Date(nextTrip.endDate).toLocaleDateString()}` : "End date TBD"}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {nextTrip?.estimatedBudget ? `Estimated budget: $${nextTrip.estimatedBudget}` : "No budget set."}
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