import { useMemo, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet"
import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { ScrollArea } from "../shared/ScrollArea"
import { Postcard } from "../trips/Postcard"

const getCoordinate = (item, fieldNames) => {
  const value = fieldNames
    .map((field) => item?.[field])
    .find(
      (fieldValue) =>
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== ""
    )

  const coordinate = Number(value)

  return Number.isFinite(coordinate) ? coordinate : null
}

const getMapPins = (trips = []) => {
  return trips.flatMap((trip) => {
    const pins = []

    const tripLatitude = getCoordinate(trip, [
      "latitude",
      "Latitude",
      "lat",
      "Lat",
    ])

    const tripLongitude = getCoordinate(trip, [
      "longitude",
      "Longitude",
      "lng",
      "Lng",
      "lon",
      "Lon",
    ])

    if (tripLatitude !== null && tripLongitude !== null) {
      pins.push({
        id:
          trip.tripID ??
          trip.id ??
          `trip-${trip.name}-${tripLatitude}-${tripLongitude}`,
        name: trip.name,
        location: trip.location,
        tripName: trip.name,
        position: [tripLatitude, tripLongitude],
      })
    }

    const legPins = (trip.legs ?? [])
      .map((leg) => {
        const latitude = getCoordinate(leg, [
          "latitude",
          "Latitude",
          "lat",
          "Lat",
        ])

        const longitude = getCoordinate(leg, [
          "longitude",
          "Longitude",
          "lng",
          "Lng",
          "lon",
          "Lon",
        ])

        if (latitude === null || longitude === null) return null

        return {
          id:
            leg.legID ??
            leg.id ??
            `${trip.tripID ?? trip.id}-${leg.name}-${latitude}-${longitude}`,
          name: leg.name,
          location: leg.location,
          tripName: trip.name,
          position: [latitude, longitude],
          trip:trip
        }
      })
      .filter(Boolean)

    return pins.concat(legPins)
  })
}

const getRandomDart = () => ({
  id: `dart-${Date.now()}`,
  position: [
    Number((Math.random() * 180 - 90).toFixed(4)),
    Number((Math.random() * 360 - 180).toFixed(4)),
  ],
})

const dartIcon = L.divIcon({
  html: `
    <div style="
      font-size: 30px;
      line-height: 30px;
      text-align: center;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,.35));
    ">
      🎯
    </div>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

export const TravelMap = () => {
  const { isPending, isError, data: trips } = useGetTrips()

  const [dart, setDart] = useState(null)

  const mapPins = useMemo(() => getMapPins(trips), [trips])

  const throwDart = () => {
    setDart(getRandomDart())
  }

  return (
    <section className="overflow-hidden rounded-lg border border-primary/20 bg-background shadow-sm shadow-primary/10 lg:col-span-2">
      <div className="grid gap-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="border-b border-primary/15 bg-primary/10 p-5 lg:border-r lg:border-b-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Travel pins</p>
              <h2 className="mt-2 text-2xl font-bold">
                Places I&apos;ve been
              </h2>
            </div>

            <button
              type="button"
              onClick={throwDart}
              className="rounded-md border border-primary/20 bg-background px-3 py-2 text-sm font-medium transition hover:bg-primary hover:text-primary-foreground"
            >
              Throw Dart 🎯
            </button>
          </div>

          <div className="mt-5 grid h-[20rem] min-h-[20rem] flex-1 gap-3 overflow-hidden">
            {isPending && (
              <div className="h-20 animate-pulse rounded-lg border border-primary/15 bg-background/70" />
            )}

            {isError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                <p className="text-sm font-semibold text-destructive">
                  Unable to load trip pins
                </p>
              </div>
            )}

            {!isPending && !isError && mapPins.length === 0 && (
              <div className="rounded-lg border border-dashed border-primary/30 bg-background px-4 py-3">
                <p className="text-sm font-semibold">No mapped trips yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add coordinates to a leg to pin it here.
                </p>
              </div>
            )}

            <ScrollArea>
              <div className="space-y-3">
                {mapPins.map((place) => (
                  <div
                    key={place.id}
                    className="rounded-lg border border-primary/15 bg-background px-4 py-3"
                  >
                    <p className="text-sm font-semibold">{place.name}</p>

                    <p className="text-sm text-muted-foreground">
                      {[place.location, place.tripName]
                        .filter(Boolean)
                        .join(" - ")}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <MapContainer
          center={[24, 8]}
          className="h-[28rem] min-h-[28rem] w-full"
          scrollWheelZoom={false}
          zoom={2}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapPins.map((place) => (
            <CircleMarker
              key={place.id}
              center={place.position}
              radius={8}
              fillColor="var(--primary)"
              fillOpacity={0.85}
              pathOptions={{
                color: "white",
                fillColor: "var(--primary)",
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                {/* <strong>{place.name}</strong>
                <br />
                {place.location}
                {place.tripName && (
                  <>
                    <br />
                    {place.tripName}
                  </>
                )} */}
                <Postcard trip={place.trip} smallText={true} />
              </Popup>
            </CircleMarker>
          ))}

          {dart && (
            <Marker position={dart.position} icon={dartIcon}>
              <Popup>
                <strong>🎯 Random Dart</strong>
                <br />
                Latitude: {dart.position[0]}
                <br />
                Longitude: {dart.position[1]}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </section>
  )
}