import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { CalendarDays, MapPin, Navigation } from "lucide-react"

const getCoordinate = (item, names) => {
  const value = names.map((name) => item?.[name]).find((candidate) => candidate !== undefined && candidate !== null && candidate !== "")
  const coordinate = Number(value)
  return Number.isFinite(coordinate) ? coordinate : null
}

const getMapPins = (trips = []) => trips.flatMap((trip) => {
  const latitude = getCoordinate(trip, ["latitude", "Latitude", "lat", "Lat"])
  const longitude = getCoordinate(trip, ["longitude", "Longitude", "lng", "Lng", "lon", "Lon"])
  const tripPins = latitude !== null && longitude !== null ? [{ id: trip.tripID ?? trip.id, name: trip.name, location: trip.location, position: [latitude, longitude], trip }] : []
  const legPins = (trip.legs ?? []).map((leg) => {
    const legLatitude = getCoordinate(leg, ["latitude", "Latitude", "lat", "Lat"])
    const legLongitude = getCoordinate(leg, ["longitude", "Longitude", "lng", "Lng", "lon", "Lon"])
    if (legLatitude === null || legLongitude === null) return null
    return { id: leg.legID ?? leg.id ?? `${trip.tripID}-${leg.name}-${legLatitude}-${legLongitude}`, name: leg.name ?? trip.name, location: leg.location ?? trip.location, position: [legLatitude, legLongitude], trip }
  }).filter(Boolean)
  return tripPins.concat(legPins)
})

const MapFocus = ({ pin, shouldFocus }) => {
  const map = useMap()
  useEffect(() => {
    if (pin && shouldFocus) map.flyTo(pin.position, Math.max(map.getZoom(), 7), { duration: 0.65 })
  }, [map, pin, shouldFocus])
  return null
}

const formatTripDates = (trip) => {
  if (!trip?.startDate) return "Dates TBD"
  const options = { month: "short", day: "numeric" }
  const start = new Date(trip.startDate).toLocaleDateString(undefined, options)
  const end = trip.endDate && new Date(trip.endDate).toLocaleDateString(undefined, options)
  return end ? `${start} – ${end}` : start
}

const formatPostcardDates = (trip) => {
  const format = (value) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "TBD"
  return trip?.startDate || trip?.endDate ? `${format(trip.startDate)} – ${format(trip.endDate)}` : "Dates TBD"
}

export const TravelMap = ({ trips = [], nextTrip, isPending, isError }) => {
  const pins = useMemo(() => getMapPins(trips), [trips])
  const [selectedPin, setSelectedPin] = useState(null)
  const [hasSelectedPin, setHasSelectedPin] = useState(false)
  const nextTripPin = useMemo(() => pins.find((pin) => pin.trip === nextTrip) ?? pins.find((pin) => pin.trip?.name === nextTrip?.name && pin.trip?.startDate === nextTrip?.startDate) ?? null, [nextTrip, pins])
  const featuredPin = nextTripPin ?? selectedPin
  const featuredTrip = nextTrip ?? featuredPin?.trip

  useEffect(() => {
    setSelectedPin((current) => hasSelectedPin ? pins.find((pin) => pin.id === current?.id) ?? nextTripPin ?? pins[0] ?? null : nextTripPin ?? pins[0] ?? null)
  }, [hasSelectedPin, nextTripPin, pins])

  return (
    <div className="relative h-full w-full">
      <MapContainer center={[24, 8]} zoom={2} minZoom={2} scrollWheelZoom className="h-full w-full" zoomControl={false}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapFocus pin={selectedPin} shouldFocus={hasSelectedPin} />
        {pins.map((pin) => (
          <CircleMarker key={pin.id} center={pin.position} radius={selectedPin?.id === pin.id ? 12 : 8} eventHandlers={{ click: () => { setSelectedPin(pin); setHasSelectedPin(true) } }} pathOptions={{ color: "white", fillColor: "var(--primary)", fillOpacity: 0.95, weight: selectedPin?.id === pin.id ? 4 : 2 }}>
            <Popup className="travel-postcard-popup" autoPanPadding={[24, 24]}>
              <Link to={`/trip?id=${pin.trip?.tripID}`} className="group relative block aspect-[4/3] w-80 overflow-hidden bg-slate-900 text-left shadow-lg">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={pin.trip?.coverPhotoSasUrl ? { backgroundImage: `url(${pin.trip.coverPhotoSasUrl})` } : { background: "linear-gradient(135deg, #172554, #7c3aed 55%, #ec4899)" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5" />
                <div className="absolute inset-0 border-[10px] border-white/95 shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.6)]" />
                <div className="absolute right-4 top-4 w-28 border border-white/70 bg-white/90 p-2 text-center text-[0.62rem] font-black tracking-[0.06em] text-foreground shadow-sm backdrop-blur-sm">{formatPostcardDates(pin.trip)}</div>
                <div className="absolute bottom-5 left-5 right-5 text-white drop-shadow-[0_2px_8px_rgb(0_0_0_/_0.7)]"><p className="font-[Yesteryear,cursive] text-4xl leading-none">{pin.trip?.location ?? pin.location ?? "Location TBD"}</p><h2 className="mt-2 text-base font-semibold leading-tight text-white/90">{pin.trip?.name ?? pin.name}</h2></div>
              </Link>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="absolute inset-x-3 bottom-32 z-[450] hidden sm:inset-x-auto sm:bottom-36 sm:left-6 sm:block sm:w-[21rem]">
        {isPending ? <div className="h-32 animate-pulse rounded-2xl bg-slate-950/70" /> : isError ? <div className="rounded-2xl bg-destructive p-4 text-sm font-semibold text-destructive-foreground">Unable to load your trip pins.</div> : featuredTrip ? (
          <div className="rounded-2xl border border-white/20 bg-slate-950/85 p-4 text-white shadow-2xl backdrop-blur-md"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground/75"><MapPin className="size-3.5" /> {featuredTrip.location ?? featuredPin?.location ?? "Pinned destination"}</p><h2 className="mt-1 truncate text-xl font-black">{featuredTrip.name ?? featuredPin?.name}</h2><p className="mt-1 flex items-center gap-2 text-sm text-white/75"><CalendarDays className="size-4" /> {formatTripDates(featuredTrip)}</p><Link to={`/trip?id=${featuredTrip.tripID ?? featuredTrip.id}`} className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">View itinerary <Navigation className="size-4" /></Link></div>
        ) : <div className="rounded-2xl border border-white/20 bg-slate-950/85 p-4 text-white shadow-xl backdrop-blur-md"><h2 className="font-black">Your map is ready.</h2><p className="mt-1 text-sm text-white/75">Add coordinates to a trip or leg to place its first pin.</p><Link to="/trips" className="mt-3 inline-flex text-sm font-bold text-primary-foreground underline">Plan a trip</Link></div>}
      </div>
    </div>
  )
}
