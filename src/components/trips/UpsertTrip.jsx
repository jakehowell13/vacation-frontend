import { SharedDialog } from "@/components/shared/SharedDialog"
import { SharedForm } from "@/components/shared/SharedForm"
import { Button } from "@/components/ui/button"
import { useStandardMutation } from "@/hooks/useStandardMutation"
import { upsertTrip } from "@/services/trip-service"
import { format } from "date-fns"
import { useState } from "react"



export const UpsertTrip = ({ trip, triggerHtml, refetch }) => {
  // const { showLoader, setShowLoader } = useFullPageLoader();

  console.log(trip);

  const [name, setName] = useState(trip?.name)
  const [destination, setDestination] = useState(trip?.location)
  const [startDate, setStartDate] = useState(trip?.startDate)
  const [endDate, setEndDate] = useState(trip?.endDate)
  const [coverImage, setCoverImage] = useState(trip?.coverImage ?? "")
  const [estimatedBudget, setEstimatedBudget] = useState(trip?.estimatedBudget ?? "");
  const [latitude, setLatitude] = useState(trip?.latitude ?? "");
  const [longitude, setLongitude] = useState(trip?.longitude ?? "");
  const [user, setUser] = useState(trip?.user);

  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidState = !!name && !!destination && !!startDate && !!endDate;

  const dto = {
    tripID: trip?.tripID,
    name: name,
    location: destination,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    user: user
  }

  const { isPending, isError, data, error, status, mutateAsync } =
    useStandardMutation({
      functionToCall: upsertTrip,
      config: {
        data: dto,
      },
    })

  const config = [
    {
      label: "Name",
      value: name,
      onChange: (e) => setName(e.target.value),
      type: "text",
      placeholder: "Trip Name",
      required: true,
      isValidState: !!name,
      validationMessage: "Trip Name cannot be empty.",
    },
    {
      label: "Destination",
      value: destination,
      onChange: (e) => setDestination(e.target.value),
      type: "text",
      placeholder: "Destination",
      required: true,
      isValidState: !!destination,
      validationMessage: "Destination cannot be empty.",
    },
    {
      label: "Start Date",
      value: startDate,
      onInputChange: (e) => {
        setStartDate(e.target.value)
      },
      type: "date",
      placeholder: "Start Date",
      required: true,
      isValidState: !!startDate,
      validationMessage: "Start Date cannot be empty.",
    },
    {
      label: "End Date",
      value: endDate,
      onInputChange: (e) => {
        setEndDate(e.target.value)
      },
      type: "date",
      placeholder: "End Date",
      required: true,
      isValidState: !!endDate,
      validationMessage: "End Date cannot be empty.",
    },
    {
      label: "Estimated Budget",
      value: estimatedBudget,
      onChange: (e) => setEstimatedBudget(e.target.value),
      type: "number",
      placeholder: "Estimated Budget",
      required: false,
      isValidState: true,
    },
    {
      label: "Latitude",
      value: latitude,
      onChange: (e) => setLatitude(e.target.value),
      type: "number",
      placeholder: "Latitude",
      required: false,
    },
    {
      label: "Longitude",
      value: longitude,
      onChange: (e) => setLongitude(e.target.value),
      type: "number",
      placeholder: "Longitude",
      required: false,
    },
    {
            label: 'People Attending',
            value: user,
            onChange: (newVal) => setUser(newVal),
            type: 'dropdown',
            placeholder: 'Select People Attending',
            required: false,
            options: [
              {
                label: 'Both',
                value: 0,
              },
              {
                label: 'Abby',
                value: 1,
              },
              {
                label: 'Jake',
                value: 2,
              }
            ],
        },
  ]

  const handleSubmit = () => {
    if (!isValidState) {
      setShowErrors(true)
      return
    }

    setIsSubmitting(true)
    // setShowLoader(true);

    mutateAsync().finally(() => {
      setIsSubmitting(false)
      // setShowLoader(false);
      refetch?.()
    })
  }

  return (
    <SharedDialog
      triggerHtml={
        triggerHtml ?? (
          <Button style={{ width: "max-content" }} className="!w-max inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/85">
            <i className="fa-solid fa-gift mr-2"></i> Create New Trip
          </Button>
        )
      }
      contentHtml={
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          <div className="flex w-full max-w-[800px] flex-col gap-2 self-center overflow-y-auto">
            <SharedForm formConfig={config} showErrors={showErrors} />
          </div>
        </div>
      }
      title={trip ? "Edit Trip" : "Add Trip"}
      saveFunction={handleSubmit}
      disableSave={!isValidState || isSubmitting}
      closeAfterSave={true}
    />
  )
}
