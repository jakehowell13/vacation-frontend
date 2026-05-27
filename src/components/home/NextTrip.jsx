import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { PlaneTakeoff } from "lucide-react"

export const NextTrip = ({ nextTrip }) => {
    
    console.log("NextTrip Component - Next Trip:", nextTrip);

    const handleClick = () => {
        if (nextTrip) {
            // Navigate to the trip details page
            window.location.href = `/trip?id=${nextTrip?.tripID}`;
        }
    }

    return (
        nextTrip ? (            
            <div className="rounded-lg border border-primary/20 bg-primary/10 p-5 relative overflow-hidden shadow-sm shadow-primary/5" onClick={handleClick}>
                {nextTrip.coverPhotoSasUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url(${nextTrip.coverPhotoSasUrl})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-black/40" />
                <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex flex-col gap-1 text-white">
                        <p className="text-xl font-bold text-primary">
                            {nextTrip?.name ? `${nextTrip.name}` : "Location TBD"}
                        </p>
                        <p className="text-md">
                            {nextTrip?.location ? `Location: ${nextTrip.location}` : "Location TBD"}
                        </p>
                        <p className="text-sm">
                            {nextTrip?.startDate && nextTrip?.endDate ? `${new Date(nextTrip.startDate).toLocaleDateString()} - ${new Date(nextTrip.endDate).toLocaleDateString()}` : "Dates TBD"}
                        </p>
                        <p className="text-sm">
                            {nextTrip?.estimatedBudget ? `Estimated budget: $${nextTrip.estimatedBudget}` : "No budget set."}
                        </p>
                    </div>
                </div>
                <div className="text-xs flex flex-row w-max gap-2 px-4 py-2 items-center justify-center rounded-full bg-primary/45 text-white absolute right-0 top-0 m-2">
                    <PlaneTakeoff className="size-5" />
                    <h2 className="font-bold">Next trip</h2>
                </div>
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