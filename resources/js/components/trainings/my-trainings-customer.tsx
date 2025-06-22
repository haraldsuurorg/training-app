import { Button } from "../ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
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
} from "../ui/alert-dialog";
import { useState } from "react";

interface Registration {
    id: number;
    status: string;
    registered_at: string;
    training: {
        id: number;
        title: string;
        description: string;
        date: string;
        location: string;
        max_participants: number;
        registrations_count: number;
    };
}

interface MyTrainingsCustomerProps {
    registrations: Registration[];
}

export function MyTrainingsCustomer({ registrations }: MyTrainingsCustomerProps) {
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const handleCancelRegistration = (registrationId: number) => {
        router.delete(route('registrations.destroy', registrationId), {
            onSuccess: () => {
                setCancellingId(null);
                toast.success('Registration deleted successfully');
                // Refetch the current page data to update the UI
                router.get(route('trainings.customer.edit'), {}, {
                    preserveState: true,
                    preserveScroll: true,
                });
            },
            onError: (errors) => {
                setCancellingId(null);
                if (errors.general) {
                    toast.error(errors.general);
                } else {
                    toast.error('Failed to delete registration');
                }
            }
        });
    };

    if (registrations.length === 0) {
        return (
            <div className="text-center py-8">
                <h2 className="text-lg font-semibold mb-2">No Registered Trainings</h2>
                <p className="text-muted-foreground">You haven't registered for any trainings yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">My Registered Trainings</h1>
            {registrations.map((registration) => (
                <div key={registration.id} className="rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-8 flex gap-8">
                    <div className="flex-4 flex flex-col gap-2">
                        <h2 className="text-lg font-bold">{registration.training.title}</h2>
                        <p className="text-muted-foreground">{registration.training.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                            {/* <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {registration.status}
                            </span> */}
                            <span className="text-muted-foreground border-t border-sidebar-border/70 dark:border-sidebar-border/70 pt-2">
                                Registered: {format(new Date(registration.registered_at), 'dd/MM/yyyy')}
                            </span>
                        </div>
                    </div>
                    <div className="flex-2 flex flex-col gap-2">
                        {/* Date */}
                        <div className="flex items-center gap-2">
                            <CalendarIcon size={18} />
                            <p className="text-muted-foreground">{format(new Date(registration.training.date), 'dd/MM/yyyy HH:mm')}</p>
                        </div>
                        {/* Location */}
                        <div className="flex items-center gap-2">
                            <MapPinIcon size={18} />
                            <p className="text-muted-foreground">{registration.training.location}</p>
                        </div>
                        {/* Participants */}
                        <div className="flex items-center gap-2">
                            <UsersIcon size={18} />
                            <p className="text-muted-foreground">
                                {registration.training.registrations_count || 0}/{registration.training.max_participants}
                            </p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="w-full"
                                    disabled={new Date(registration.training.date) <= new Date()}
                                >
                                    <XIcon className="h-4 w-4 mr-2" />
                                    Delete Registration
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete your registration for "{registration.training.title}"? 
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Registration</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => handleCancelRegistration(registration.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Yes, Delete Registration
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            ))}
        </div>
    );
}