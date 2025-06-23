import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Training } from "@/types";

interface DeleteTrainingRegistrationProps {
    training: Training & { registrationId: number };
}

export function DeleteTrainingRegistration({ training }: DeleteTrainingRegistrationProps) {
    const handleCancelRegistration = (registrationId: number) => {
        router.delete(route('registrations.destroy', registrationId), {
            onSuccess: () => {
                toast.success('Registration deleted successfully');
                // Invalidate all related data to keep all pages in sync
                router.reload({ only: ['registrations', 'trainings'] });
            },
            onError: (errors) => {
                if (errors.general) {
                    toast.error(errors.general);
                } else {
                    toast.error('Failed to delete registration');
                }
            }
        });
    };

    const isPastTraining = new Date(training.date) <= new Date();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    disabled={isPastTraining}
                >
                    <XIcon className="h-4 w-4 mr-2" />
                    {isPastTraining ? "Training Completed" : "Cancel Registration"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cancel your registration for "{training.title}"? 
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Keep Registration</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={() => handleCancelRegistration(training.registrationId)}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Yes, Cancel Registration
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 