import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
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
} from "../ui/alert-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Training } from "@/types";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { format } from "date-fns";

interface RegisterTrainingProps {
    training: Training;
}

export function RegisterTraining({ training }: RegisterTrainingProps) {
    const [open, setOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    const handleRegister = () => {
        router.post(route('registrations.store'), {
            training_id: training.id,
        }, {
            onSuccess: () => {
                setAlertOpen(false);
                setOpen(false);
                toast.success('Registration successful');
                // Invalidate all related data to keep all pages in sync
                router.reload({ only: ['trainings', 'registrations'] });
            },
            onError: (errors) => {
                // Show specific error messages if available
                if (errors.training_id) {
                    toast.error(errors.training_id);
                } else if (errors.general) {
                    toast.error(errors.general);
                } else {
                    // Fallback to generic message if no specific error
                    console.error('Registration failed:', errors);
                    toast.error('Registration failed');
                }
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Register
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register for Training</DialogTitle>
                    <DialogDescription>
                        Register for "{training.title}" training.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Training Details:</h4>
                        <p className="text-sm text-muted-foreground">{training.description}</p>
                        <div className="flex flex-col my-4">
                            <p className=""><strong>Date:</strong> {format(new Date(training.date), 'dd/MM/yyyy HH:mm')}</p>
                            <p className=""><strong>Location:</strong> {training.location}</p>
                            <p className=""><strong>Places:</strong> {training.registrations_count || 0}/{training.max_participants}</p>
                        </div>
                    </div>
                    
                    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="">
                                <Plus className="h-4 w-4 mr-2" />
                                Confirm Registration
                            </Button> 
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to register for "{training.title}"? 
                                    This action will submit your registration and you will be notified of the outcome.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRegister}>
                                    Yes, Register Me
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DialogContent>
        </Dialog>
    );
} 