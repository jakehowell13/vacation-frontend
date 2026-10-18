import { SharedDialog } from "@/components/shared/SharedDialog"
import { SharedForm } from "@/components/shared/SharedForm"
import { Button } from "@/components/ui/button"
import { useStandardMutation } from "@/hooks/useStandardMutation"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { upsertTrip } from "@/services/trip-service"
import { Check, Plus, Search, UserPlus, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const getProfileName = (profile) => profile?.display_name || profile?.email || "Traveler"

const AttendeePicker = ({ attendeeIds, onChange, currentUser }) => {
  const [directory, setDirectory] = useState([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDirectory = async () => {
      const { data, error: directoryError } = await supabase
        .from("profiles")
        .select("id, display_name, email")
        .order("display_name", { ascending: true })
        .limit(100)

      if (directoryError) {
        setError("Unable to load travelers. Apply the latest Supabase migration to enable invitations.")
        return
      }
      setDirectory(data ?? [])
    }

    loadDirectory()
  }, [])

  const currentProfile = useMemo(() => ({
    id: currentUser?.id,
    display_name: currentUser?.user_metadata?.display_name ?? currentUser?.user_metadata?.full_name,
    email: currentUser?.email,
  }), [currentUser])

  const profilesById = useMemo(() => new Map([...directory, currentProfile].filter((profile) => profile?.id).map((profile) => [profile.id, profile])), [directory, currentProfile])
  const selectedProfiles = attendeeIds.map((id) => profilesById.get(id) ?? { id, display_name: "Invited traveler" })
  const normalizedSearch = search.trim().toLowerCase()
  const results = directory.filter((profile) => !attendeeIds.includes(profile.id) && (!normalizedSearch || getProfileName(profile).toLowerCase().includes(normalizedSearch) || profile.email?.toLowerCase().includes(normalizedSearch))).slice(0, 8)

  const addAttendee = (id) => onChange([...new Set([...attendeeIds, id])])
  const removeAttendee = (id) => onChange(attendeeIds.filter((attendeeId) => attendeeId !== id))

  return (
    <section className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
      <div className="flex items-start justify-between gap-3"><div><p className="font-bold">Who&apos;s going?</p><p className="mt-1 text-sm text-muted-foreground">You&apos;re included automatically. Search and add other travelers.</p></div><UserPlus className="size-5 shrink-0 text-primary" /></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedProfiles.map((profile) => <span key={profile.id} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1.5 text-sm font-semibold"><span className="grid size-5 place-items-center rounded-full bg-primary/15 text-[10px] text-primary">{getProfileName(profile)[0]?.toUpperCase()}</span>{getProfileName(profile)}{profile.id !== currentUser?.id && <button type="button" onClick={() => removeAttendee(profile.id)} className="rounded-full text-muted-foreground transition hover:text-foreground" aria-label={`Remove ${getProfileName(profile)}`}><X className="size-3.5" /></button>}</span>)}
      </div>
      <div className="relative mt-4"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people by name or email" className="h-11 w-full rounded-xl border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : normalizedSearch && <div className="mt-2 overflow-hidden rounded-xl border border-primary/15 bg-background">{results.length ? results.map((profile) => <button key={profile.id} type="button" onClick={() => { addAttendee(profile.id); setSearch("") }} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-primary/5"><span><span className="block text-sm font-bold">{getProfileName(profile)}</span><span className="block text-xs text-muted-foreground">{profile.email}</span></span><Plus className="size-4 text-primary" /></button>) : <p className="px-3 py-3 text-sm text-muted-foreground">No matching travelers.</p>}</div>}
    </section>
  )
}

export const UpsertTrip = ({ trip, triggerHtml, refetch }) => {
  const { user: currentUser } = useAuth()
  const [name, setName] = useState(trip?.name)
  const [destination, setDestination] = useState(trip?.location)
  const [startDate, setStartDate] = useState(trip?.startDate)
  const [endDate, setEndDate] = useState(trip?.endDate)
  const [estimatedBudget, setEstimatedBudget] = useState(trip?.estimatedBudget ?? "")
  const [latitude, setLatitude] = useState(trip?.latitude ?? "")
  const [longitude, setLongitude] = useState(trip?.longitude ?? "")
  const [attendeeIds, setAttendeeIds] = useState(trip?.attendeeIds ?? [])
  const [showErrors, setShowErrors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (currentUser?.id) setAttendeeIds((ids) => [...new Set([...ids, currentUser.id])])
  }, [currentUser?.id])

  const isValidState = !!name && !!destination && !!startDate && !!endDate
  const dto = { tripID: trip?.tripID, name, location: destination, startDate: new Date(startDate), endDate: new Date(endDate), estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null, latitude: latitude ? parseFloat(latitude) : null, longitude: longitude ? parseFloat(longitude) : null, attendeeIds }
  const { mutateAsync } = useStandardMutation({ functionToCall: upsertTrip, config: { data: dto } })

  const config = [
    { label: "Name", value: name, onChange: (event) => setName(event.target.value), type: "text", placeholder: "Trip Name", required: true, isValidState: !!name, validationMessage: "Trip Name cannot be empty." },
    { label: "Destination", value: destination, onChange: (event) => setDestination(event.target.value), type: "text", placeholder: "Destination", required: true, isValidState: !!destination, validationMessage: "Destination cannot be empty." },
    { label: "Start Date", value: startDate, onInputChange: (event) => setStartDate(event.target.value), type: "date", placeholder: "Start Date", required: true, isValidState: !!startDate, validationMessage: "Start Date cannot be empty." },
    { label: "End Date", value: endDate, onInputChange: (event) => setEndDate(event.target.value), type: "date", placeholder: "End Date", required: true, isValidState: !!endDate, validationMessage: "End Date cannot be empty." },
    { label: "Estimated Budget", value: estimatedBudget, onChange: (event) => setEstimatedBudget(event.target.value), type: "number", placeholder: "Estimated Budget", required: false },
    { label: "Latitude", value: latitude, onChange: (event) => setLatitude(event.target.value), type: "number", placeholder: "Latitude", required: false },
    { label: "Longitude", value: longitude, onChange: (event) => setLongitude(event.target.value), type: "number", placeholder: "Longitude", required: false },
  ]

  const handleSubmit = () => {
    if (!isValidState) return setShowErrors(true)
    setIsSubmitting(true)
    mutateAsync().finally(() => { setIsSubmitting(false); refetch?.() })
  }

  return <SharedDialog triggerHtml={triggerHtml ?? <Button className="!w-max inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/85">Create New Trip</Button>} contentHtml={<div className="mx-auto flex w-full max-w-[800px] flex-col gap-4"><SharedForm formConfig={config} showErrors={showErrors} /><AttendeePicker attendeeIds={attendeeIds} onChange={setAttendeeIds} currentUser={currentUser} /></div>} title={trip ? "Edit Trip" : "Add Trip"} saveFunction={handleSubmit} disableSave={!isValidState || isSubmitting} closeAfterSave />
}
