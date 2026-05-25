import { useStandardMutation } from "@/hooks/useStandardMutation";
import { upsertToDo } from "@/services/trip-service";
import { useState } from "react";
import { SharedDialog } from "../shared/SharedDialog";
import { Button } from "../ui/button";
import { SharedForm } from "../shared/SharedForm";

export const UpsertToDo = ({ toDo, trip, triggerHtml, refetch }) => {

    const [description, setDescription] = useState(toDo?.description);
    const [showErrors, setShowErrors] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isValidState = !!description;

    const dto = {
        toDoID: toDo?.toDoID,
        description: description,
        isCompleted: toDo?.isCompleted || false
    };

    const { isPending, isError, data, error, status, mutateAsync } = useStandardMutation({
        functionToCall: upsertToDo,
        config: {
            data: dto,
            tripID: trip.tripID
        }
    });

    const config = [
        {
            label: 'Description',
            value: description,
            onChange: (e) => setDescription(e.target.value),
            type: 'textarea',
            placeholder: 'Description',
            required: true,
            isValidState: !!description,
            validationMessage: 'Description cannot be empty.'
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
                <Button>Create New To-Do</Button>
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