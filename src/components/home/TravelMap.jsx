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

export const TravelMap = ({ trips = [], isPending, isError }) => {
  const pins = useMemo(() => getMapPins(trips), [trips])
  const [selectedPin, setSelectedPin] = useState(null)
  const [hasSelectedPin, setHasSelectedPin] = useState(false)

  useEffect(() => {
    setSelectedPin((current) => pins.find((pin) => pin.id === current?.id) ?? pins[0] ?? null)
  }, [pins])

  return (
    <div className="relative h-full w-full">
      <MapContainer center={[24, 8]} zoom={2} minZoom={2} scrollWheelZoom className="h-full w-full" zoomControl={false}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapFocus pin={selectedPin} shouldFocus={hasSelectedPin} />
        {pins.map((pin) => (
          <CircleMarker key={pin.id} center={pin.position} radius={selectedPin?.id === pin.id ? 12 : 8} eventHandlers={{ click: () => { setSelectedPin(pin); setHasSelectedPin(true) } }} pathOptions={{ color: "white", fillColor: "var(--primary)", fillOpacity: 0.95, weight: selectedPin?.id === pin.id ? 4 : 2 }}>
            <Popup><strong>{pin.name}</strong>{pin.location && <><br />{pin.location}</>}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="absolute right-3 top-28 z-[450] hidden w-64 rounded-2xl border border-white/20 bg-slate-950/80 p-3 text-white shadow-xl backdrop-blur-md lg:block">
        <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/65">Map pins · {pins.length}</p>
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {pins.map((pin) => <button key={pin.id} type="button" onClick={() => { setSelectedPin(pin); setHasSelectedPin(true) }} className={`w-full rounded-xl px-3 py-2 text-left transition ${selectedPin?.id === pin.id ? "bg-primary text-primary-foreground" : "hover:bg-white/10"}`}><p className="truncate text-sm font-bold">{pin.name}</p><p className={`truncate text-xs ${selectedPin?.id === pin.id ? "text-primary-foreground/80" : "text-white/60"}`}>{pin.location ?? pin.trip?.name}</p></button>)}
        </div>
      </div>

      <div className="absolute inset-x-3 bottom-32 z-[450] sm:inset-x-auto sm:bottom-36 sm:left-6 sm:w-[21rem]">
        {isPending ? <div className="h-32 animate-pulse rounded-2xl bg-slate-950/70" /> : isError ? <div className="rounded-2xl bg-destructive p-4 text-sm font-semibold text-destructive-foreground">Unable to load your trip pins.</div> : selectedPin ? (
          <div className="rounded-2xl border border-white/20 bg-slate-950/85 p-4 text-white shadow-2xl backdrop-blur-md"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground/75"><MapPin className="size-3.5" /> {selectedPin.location ?? "Pinned destination"}</p><h2 className="mt-1 truncate text-xl font-black">{selectedPin.trip?.name ?? selectedPin.name}</h2><p className="mt-1 flex items-center gap-2 text-sm text-white/75"><CalendarDays className="size-4" /> {formatTripDates(selectedPin.trip)}</p><Link to={`/trip?id=${selectedPin.trip?.tripID}`} className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">View itinerary <Navigation className="size-4" /></Link></div>
        ) : <div className="rounded-2xl border border-white/20 bg-slate-950/85 p-4 text-white shadow-xl backdrop-blur-md"><h2 className="font-black">Your map is ready.</h2><p className="mt-1 text-sm text-white/75">Add coordinates to a trip or leg to place its first pin.</p><Link to="/trips" className="mt-3 inline-flex text-sm font-bold text-primary-foreground underline">Plan a trip</Link></div>}
      </div>
    </div>
  )
}
