import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { RegistrationData } from "@/types";
import { DataTable } from "@/components/manage-registrations/data-table";
import { createColumns } from "@/components/manage-registrations/columns";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface ManageRegistrationsProps {
  registrations: RegistrationData[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Manage Registrations',
    href: '/admin/registrations',
  },
];

export default function ManageRegistrations() {
  const { registrations } = usePage().props as unknown as ManageRegistrationsProps;
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = (registrationId: number, newStatus: string) => {
    router.put(route('registrations.update-status', registrationId), {
      status: newStatus,
    }, {
      onSuccess: () => {
        toast.success('Registration status updated successfully');
        // Invalidate all related data to keep all pages in sync
        router.reload({ only: ['trainings', 'registrations'] });
      },
      onError: (errors) => {
        if (errors.general) {
          toast.error(errors.general);
        } else {
          toast.error('Failed to update registration status');
        }
      }
    });
  };

  const handleDeleteClick = (registrationId: number) => {
    setDeletingId(registrationId);
  };

  const handleDeleteConfirm = () => {
    if (!deletingId || isDeleting) return;
    
    setIsDeleting(true);
    router.delete(route('registrations.destroy', deletingId), {
      onSuccess: () => {
        toast.success('Registration deleted successfully');
        setDeletingId(null);
        setIsDeleting(false);
        // Invalidate all related data to keep all pages in sync
        router.reload({ only: ['trainings', 'registrations'] });
      },
      onError: (errors) => {
        setIsDeleting(false);
        if (errors.general) {
          toast.error(errors.general);
        } else {
          toast.error('Failed to delete registration');
        }
      }
    });
  };

  const handleDeleteCancel = () => {
    setDeletingId(null);
    setIsDeleting(false);
  };

  const currentRegistration = registrations.find(r => r.id === deletingId);

  const columns = createColumns({
    onStatusChange: handleStatusChange,
    onDeleteClick: handleDeleteClick,
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Registrations" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Registrations</h1>
          <div className="text-sm text-muted-foreground">
            Total: {registrations.length} registrations
          </div>
        </div>

        <DataTable columns={columns} data={registrations} />
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && handleDeleteCancel()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Registration</AlertDialogTitle>
              <AlertDialogDescription>
                {currentRegistration && (
                  <>
                    Are you sure you want to delete {currentRegistration.user.name}'s registration for "{currentRegistration.training.title}"? 
                    This action cannot be undone.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Registration'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
