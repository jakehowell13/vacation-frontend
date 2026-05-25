import "leaflet/dist/leaflet.css"
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet"
import { useGetTrips } from "@/hooks/trips/useGetTrips"
import { ScrollArea } from "../shared/ScrollArea"

const getCoordinate = (item, fieldNames) => {
  const value = fieldNames
    .map((field) => item?.[field])
    .find(
      (fieldValue) =>
        fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
    )
  const coordinate = Number(value)

  return Number.isFinite(coordinate) ? coordinate : null
}

const getMapPins = (trips = []) => {
  return trips.flatMap((trip) =>
    (trip.legs ?? [])
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
        }
      })
      .filter(Boolean)
  )
}

export const TravelMap = () => {
  const { isPending, isError, data: trips } = useGetTrips()
  const mapPins = getMapPins(trips)

  return (
    <section className="overflow-hidden rounded-lg border border-primary/20 bg-background shadow-sm shadow-primary/10 lg:col-span-2">
      <div className="grid gap-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="border-b border-primary/15 bg-primary/10 p-5 lg:border-r lg:border-b-0">
          <p className="text-sm font-semibold text-primary">Travel pins</p>
          <h2 className="mt-2 text-2xl font-bold">Places I&apos;ve been</h2>
          <div className="mt-5 grid gap-3 ovberflow-hidden flex-1 h-[20rem] min-h-[20rem]">
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
              {mapPins.map((place) => (
                <div
                  key={place.id}
                  className="rounded-lg border border-primary/15 bg-background px-4 py-3"
                >
                  <p className="text-sm font-semibold">{place.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {[place.location, place.tripName].filter(Boolean).join(" - ")}
                  </p>
                </div>
              ))}
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
              center={place.position}
              fillColor="var(--primary)"
              fillOpacity={0.85}
              key={place.id}
              pathOptions={{
                color: "white",
                fillColor: "var(--primary)",
                fillOpacity: 0.85,
                weight: 2,
              }}
              radius={8}
            >
              <Popup>
                <strong>{place.name}</strong>
                <br />
                {place.location}
                {place.tripName && (
                  <>
                    <br />
                    {place.tripName}
                  </>
                )}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  )
}
