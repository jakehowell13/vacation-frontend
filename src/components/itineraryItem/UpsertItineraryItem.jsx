import { SharedDialog } from "@/components/shared/SharedDialog";
import { SharedForm } from "@/components/shared/SharedForm";
import { Button } from "@/components/ui/button";
import { useStandardMutation } from "@/hooks/useStandardMutation";
import { upsertItineraryItem, upsertTrip } from "@/services/trip-service";
import { format } from "date-fns";
import { useState } from "react"

export const UpsertItineraryItem = ({ itineraryItem, trip, triggerHtml, refetch })  => {

    // const { showLoader, setShowLoader } = useFullPageLoader();

    const [name, setName] = useState(itineraryItem?.name);
    const [itineraryType, setItineraryType] = useState(itineraryItem?.itineraryType);
    const [description, setDescription] = useState(itineraryItem?.description);
    const [externalLink, setExternalLink] = useState(itineraryItem?.externalLink);
    const [legID, setLegID] = useState(itineraryItem?.legID);
    const [startDateTime, setStartDateTime] = useState(itineraryItem?.startDateTime);
    const [endDateTime, setEndDateTime] = useState(itineraryItem?.endDateTime);
    const [cost, setCost] = useState(itineraryItem?.cost);
    
    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isEndDateOpen, setIsEndDateOpen] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isValidState = !!name;

    const dto = {
        itineraryItemID: itineraryItem?.itineraryItemID,
        itineraryType: itineraryType,
        name: name,
        description: description,
        externalLink: externalLink,
        legID: legID,
        startDateTime: startDateTime ? new Date(startDateTime) : null,
        endDateTime: endDateTime ? new Date(endDateTime) : null,
        cost: cost ? parseFloat(cost) : null
    };

    const { isPending, isError, data, error, status, mutateAsync } = useStandardMutation({
        functionToCall: upsertItineraryItem,
        config: {
            data: dto,
            tripID: trip.tripID
        }
    });

    const config = [
        {
            label: 'Name',
            value: name,
            onChange: (e) => setName(e.target.value),
            type: 'text',
            placeholder: 'Trip Name',
            required: true,
            isValidState: !!name,
            validationMessage: 'Trip Name cannot be empty.'
        },
        {
            label: 'Description',
            value: description,
            onChange: (e) => setDescription(e.target.value),
            type: 'textarea',
            placeholder: 'Description',
            required: true,
            isValidState: !!description,
            validationMessage: 'Description cannot be empty.'
        },
        {
            label: 'External Link',
            value: externalLink,
            onChange: (e) => setExternalLink(e.target.value),
            type: 'text',
            placeholder: 'External Link',
            required: false,
        },
        {
            label: 'Cost',
            value: cost,
            onChange: (e) => setCost(e.target.value),
            type: 'number',
            placeholder: 'Cost',
            required: false,
        },
        {
            label: 'Start Date',
            value: startDateTime,
            onInputChange: (e) => { 
                setStartDate(e.target.value);
            },
            onSelectChange: (date) => setStartDateTime(date ? format(date, "yyyy-MM-dd") : ""),
            type: 'date',
            placeholder: 'Start Date',
            required: false,
            open: isStartDateOpen,
            setOpen: setIsStartDateOpen,
        },
        {
            label: 'End Date',
            value: endDateTime,
            onInputChange: (e) => { 
                setEndDate(e.target.value);
            },
            onSelectChange: (date) => setEndDateTime(date ? format(date, "yyyy-MM-dd") : ""),
            type: 'date',
            placeholder: 'End Date',
            required: false,
            open: isEndDateOpen,
            setOpen: setIsEndDateOpen,
        },
        {
            label: 'Leg',
            value: legID,
            onChange: (newVal) => setLegID(newVal),
            type: 'dropdown',
            placeholder: 'Select Leg',
            required: false,
            options: trip.legs?.map(leg => ({
                label: leg.name,
                value: leg.legID
            })) || [],
        }
    ];

    const handleSubmit = () => {

        if (!isValidState) {
            setShowErrors(true);
            return;
        }

        setIsSubmitting(true);
        // setShowLoader(true);

        mutateAsync()
            .finally(() => {
                setIsSubmitting(false);
                // setShowLoader(false);
                refetch?.();
            });
    }

    return (
        <SharedDialog
            triggerHtml={triggerHtml ??
                <Button>Create New Itinerary Item</Button>
            }
            contentHtml={
                <div className="flex flex-col gap-2 overflow-hidden flex-1">
                    <div className="flex flex-col gap-2 overflow-y-auto w-full max-w-[800px] self-center">
                        <SharedForm formConfig={config} showErrors={showErrors} />
                    </div>
                </div>
            }
            title={trip ? "Edit Itinerary Item" : "Add Itinerary Item"}
            saveFunction={handleSubmit}
            disableSave={!isValidState || isSubmitting}
            closeAfterSave={true}
         />
    )

}
