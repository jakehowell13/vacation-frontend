import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { AreYouSure } from './AreYouSure';
import { ScrollArea } from './ScrollArea';

export const SharedDialog = ({
    triggerHtml,
    title,
    description,
    contentHtml,
    footerHtml,
    saveFunction,
    deleteFunction,
    cancelFunction,
    showDelete = false,
    deleteText = 'Delete',
    showCancel = true,
    cancelText = 'Cancel',
    showSave = true,
    saveText = 'Save',
    dimensionClasses,
    closeAfterSave = false,
    disableSave,
    disableCancel,
    disableDelete,
    open,
    setOpen
}) => {
    return (
        <Dialog className="overflow-hidden flex flex-1">
            <DialogTrigger className="cursor-pointer w-max">{triggerHtml}</DialogTrigger>
            <DialogContent className={`bg-(--card) border border-(--border-color) max-w-[60vw] max-h-[80vh] overflow-hidden flex flex-col ${dimensionClasses}`}>
                {title || description && 
                    <DialogHeader className={'pb-2'}>
                    {title && <DialogTitle className={'!text-2xl'}>{title}</DialogTitle>}
                    {description && 
                        <DialogDescription>{description}</DialogDescription>
                    }
                    </DialogHeader>
                }
                <ScrollArea>
                    {contentHtml}
                </ScrollArea>
                <DialogFooter>
                    {footerHtml ?? 
                        <div className='flex flex-row gap-2 items-center justify-between w-full'>
                            {showDelete && 
                                <AreYouSure
                                    triggerHtml={
                                        <Button variant="destructive" className={'text-lg bg-(--transparent-bg) cursor-pointer'} disabled={disableDelete}>
                                            {deleteText}
                                        </Button>
                                    }
                                    title="Are you sure?"
                                    description="This action cannot be undone."
                                    confirmFunction={deleteFunction}
                                    isLoading={disableDelete}
                                />
                            }
                            <div className='flex flex-row gap-2 items-center justify-end w-full'>
                                {showCancel && 
                                <DialogClose asChild>
                                    <Button variant='outline' className={'cursor-pointer hover:bg-gray-500/50'} disabled={disableCancel} onClick={cancelFunction}>
                                        {cancelText}
                                    </Button>
                                </DialogClose>}
                                {showSave && 
                                    (closeAfterSave ?
                                        <DialogClose asChild>
                                            <Button variant='default' className={' cursor-pointer '} disabled={disableSave} onClick={saveFunction}>
                                                {saveText}
                                            </Button>
                                        </DialogClose>
                                    :
                                        <Button variant='default' className={' cursor-pointer '} disabled={disableSave} onClick={saveFunction}>
                                            {saveText}
                                        </Button>
                                )}
                            </div>
                        </div>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}