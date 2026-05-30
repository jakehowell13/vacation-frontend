import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"

export const Postcard = ({ trip, smallText = false }) => {

    console.log(trip);
    const navigate = useNavigate();

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

    const hasImage = !!trip.coverPhotoSasUrl
    const location = trip.location || "Location TBD"
    const locationTextSize = smallText ? 'text-xl' :
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
        <div
            key={trip.tripID}
            type="button"
            className="group relative aspect-[4/3] min-h-50 overflow-hidden rounded-lg border border-white bg-primary/10 text-left shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/15 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
                <div className="leading-tight text-foreground">
                {dateRange}
                </div>
            </div>

            <div className="absolute right-5 bottom-5 left-5 text-white drop-shadow-[0_2px_8px_rgb(0_0_0_/_0.65)]">
                <p
                style={{ margin: 0 }}
                className={`flex items-center gap-2 leading-none font-normal text-white ${locationTextSize}`}
                >
                {/* <MapPin className="size-5 shrink-0" /> */}
                <span className="font-[Yesteryear,cursive]">
                    {location}
                </span>
                </p>
                <h2 className={`mt-2 line-clamp-2 ${smallText ? 'text-md' : 'text-lg'} leading-tight font-semibold tracking-normal text-white/85`}>
                {trip.name}
                </h2>
                {/* <p className="mt-2 text-xs font-medium text-white/80">
                Trip {index + 1} -{" "}
                {getTripDuration(trip.startDate, trip.endDate)}
                </p> */}
            </div>
        </div>
    )
}