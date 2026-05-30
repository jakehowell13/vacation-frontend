import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { TripCalendar } from "./TripCalendar"
import { useState } from "react"        

export const Calendar = () => {

    const {data: trips} = useGetTrips()

    if(!trips || trips.length === 0) {
        return (
            <div className="flex h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-primary/15 bg-primary/5 p-6 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                    No trips planned yet
                </h2>
                <p className="text-sm text-muted-foreground">
                    Once you add trips, you&apos;ll see them here in the calendar view.
                </p>
            </div>
        )
    }

  return (
    <div className="p-6">
        <TripCalendar trips={trips} />
    </div>
  )
}