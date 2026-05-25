import { SharedDialog } from "@/components/shared/SharedDialog";
import { SharedForm } from "@/components/shared/SharedForm";
import { Button } from "@/components/ui/button";
import { useStandardMutation } from "@/hooks/useStandardMutation";
import { uploadTripCoverPhoto } from "@/services/trip-service";
import { Camera } from "lucide-react";
import { useState } from "react";

export const UpsertTripCoverImage = ({ trip, triggerHtml, refetch }) => {
    const [file, setFile] = useState(null);

    const [showErrors, setShowErrors] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutateAsync } = useStandardMutation({
        functionToCall: uploadTripCoverPhoto,
        config: {
            tripId: trip?.tripID,
            file: file
        }
    });

    const isValidState = !!file; // require a file

    const config = [
        {
            label: "Cover Image",
            value: file,
            onChange: setFile,
            type: "image", // make sure this returns a File object
            required: true,
            disabled: isSubmitting,
        },
    ];

    const handleSubmit = () => {
        if (!isValidState) {
            setShowErrors(true);
            return;
        }

        setIsSubmitting(true);

        console.log(file);

        mutateAsync()
            .finally(() => {
                setIsSubmitting(false);
                refetch?.();
            });
    };

    return (
        <SharedDialog
            triggerHtml={
                triggerHtml ?? (
                    <Button>
                        <Camera /> Upload Photo
                    </Button>
                )
            }
            contentHtml={
                <div className="flex flex-col gap-2 overflow-hidden flex-1">
                    <div className="flex flex-col gap-2 overflow-y-auto w-full max-w-[800px] self-center">
                        <SharedForm formConfig={config} showErrors={showErrors} />
                    </div>
                </div>
            }
            title="Upload Cover Photo"
            saveFunction={handleSubmit}
            disableSave={!isValidState || isSubmitting}
            closeAfterSave={true}
        />
    );
};