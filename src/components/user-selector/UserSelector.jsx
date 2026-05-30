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
import { Button } from "@/components/ui/button"
import { useUser } from "@/providers/UserProvider"
import { User } from "lucide-react";
import { useEffect, useState } from "react";

export function UserSelector({ forceOpen = false }) {
    const { user, setUser } = useUser();
    const [isOpen, setIsOpen] = useState(forceOpen);

    useEffect(() => {
      if (forceOpen && user == null) {
        setIsOpen(true)
      }
    }, [forceOpen, user])

    const handleSelectUser = (selectedUser) => {
        setUser(selectedUser);
        setIsOpen(false);
    }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary transition-colors hover:bg-primary/20">
          <User className="size-3 text-primary" />
          {user === 1 ? "Abby" : user === 2 ? "Jake" : "Select user"}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Wait a minute... Who are you?</AlertDialogTitle>
          <AlertDialogDescription>
            Don't lie. I'll know.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => handleSelectUser(1)}>Abby</Button>
          <Button onClick={() => handleSelectUser(2)}>Jake</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
