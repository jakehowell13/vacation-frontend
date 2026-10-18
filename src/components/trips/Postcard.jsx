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
    const coverThemes = [
        ["#151b35", "#3f2b96", "#ec4899"],
        ["#102a43", "#0f766e", "#38bdf8"],
        ["#3f1d2e", "#b45309", "#fbbf24"],
        ["#18212f", "#334155", "#a855f7"],
    ]
    const themeIndex = [...(trip.tripID ?? trip.name ?? "trip")].reduce((total, character) => total + character.charCodeAt(0), 0) % coverThemes.length
    const [base, middle, accent] = coverThemes[themeIndex]
    const destinationInitial = (trip.location || trip.name || "V").trim().charAt(0).toUpperCase()
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
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${base}, ${middle} 58%, ${accent})` }}
                >
                    <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
                    <div className="absolute -right-12 -top-16 size-52 rounded-full border-[22px] border-white/15" />
                    <div className="absolute -bottom-14 -left-10 size-44 rounded-full border border-white/25" />
                    <div className="absolute left-[16%] top-[38%] h-px w-[68%] rotate-[-18deg] border-t-2 border-dashed border-white/65" />
                    <div className="absolute left-[14%] top-[42%] size-3 rounded-full border-2 border-white bg-transparent" />
                    <div className="absolute right-[14%] top-[23%] grid size-11 place-items-center rounded-full bg-white/90 text-xl font-black shadow-lg" style={{ color: accent }}>{destinationInitial}</div>
                    <p className="absolute left-5 top-5 text-[0.65rem] font-black uppercase tracking-[0.28em] text-white/75">Vacation atlas</p>
                    <p className="absolute right-5 bottom-20 rotate-[-90deg] text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/50">Adventure route</p>
                </div>
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
