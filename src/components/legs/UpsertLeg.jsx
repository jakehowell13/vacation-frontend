import { SharedDialog } from "@/components/shared/SharedDialog";
import { SharedForm } from "@/components/shared/SharedForm";
import { Button } from "@/components/ui/button";
import { useStandardMutation } from "@/hooks/useStandardMutation";
import { upsertLeg } from "@/services/trip-service";
import { useState } from "react";

export const UpsertLeg = ({ leg, trip, triggerHtml, refetch }) => {
  const [name, setName] = useState(leg?.name ?? "");
  const [location, setLocation] = useState(leg?.location ?? "");
  const [latitude, setLatitude] = useState(leg?.latitude ?? "");
  const [longitude, setLongitude] = useState(leg?.longitude ?? "");
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidState = !!name;

  const parseCoordinate = (value) => {
    if (value === "" || value === undefined || value === null) return null;

    const coordinate = Number(value);
    return Number.isFinite(coordinate) ? coordinate : null;
  };

  const dto = {
    legID: leg?.legID,
    tripID: trip?.tripID,
    name,
    location,
    latitude: parseCoordinate(latitude),
    longitude: parseCoordinate(longitude),
    itineraryItems: leg?.itineraryItems ?? [],
  };

  const { mutateAsync } = useStandardMutation({
    functionToCall: upsertLeg,
    config: {
      data: dto,
      tripID: trip.tripID,
      legID: leg?.legID,
    },
  });

  const config = [
    {
      label: "Name",
      value: name,
      onChange: (e) => setName(e.target.value),
      type: "text",
      placeholder: "Leg Name",
      required: true,
      isValidState: !!name,
      validationMessage: "Leg Name cannot be empty.",
    },
    {
      label: "Location",
      value: location,
      onChange: (e) => setLocation(e.target.value),
      type: "text",
      placeholder: "Location",
      required: false,
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
  ];

  const handleSubmit = () => {
    if (!isValidState) {
      setShowErrors(true);
      return;
    }

    setIsSubmitting(true);

    mutateAsync().finally(() => {
      setIsSubmitting(false);
      refetch?.();
    });
  };

  return (
    <SharedDialog
      triggerHtml={triggerHtml ?? <Button>Create New Leg</Button>}
      contentHtml={
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          <div className="flex w-full max-w-[800px] flex-col gap-2 self-center overflow-y-auto">
            <SharedForm formConfig={config} showErrors={showErrors} />
          </div>
        </div>
      }
      title={leg ? "Edit Leg" : "Add Leg"}
      saveFunction={handleSubmit}
      disableSave={!isValidState || isSubmitting}
      closeAfterSave={true}
    />
  );
};
