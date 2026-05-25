import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const AreYouSure = ({
    triggerHtml,
    title = 'Are you sure?',
    description = 'This action cannot be undone. This will be permanently removed.',
    additionalContent,
    confirmFunction
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {triggerHtml}
            </AlertDialogTrigger>
            <AlertDialogContent className={'bg-card border-0'}>
                <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                {additionalContent}
                <AlertDialogFooter>
                <AlertDialogCancel className={'bg-(--accent) border-0 cursor-pointer hover:bg-(--hover-bg)'}>Cancel</AlertDialogCancel>
                <AlertDialogAction className={'bg-(--transparent-bg) cursor-pointer hover:bg-(--hover-bg)'} onClick={confirmFunction}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}