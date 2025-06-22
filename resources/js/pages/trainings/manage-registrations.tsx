import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { format } from "date-fns";
import { MoreHorizontal, Trash2 } from "lucide-react";
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
import { useState } from "react";

interface RegistrationData {
  id: number;
  status: string;
  registered_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  training: {
    id: number;
    title: string;
    date: string;
  };
}

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
        // Refetch the current page data to update the table
        router.get(route('admin.registrations.index'), {}, {
          preserveState: true,
          preserveScroll: true,
          only: ['registrations']
        });
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
        // Refetch the current page data to update the table
        router.get(route('admin.registrations.index'), {}, {
          preserveState: true,
          preserveScroll: true,
          only: ['registrations']
        });
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Training</TableHead>
                <TableHead>Training Date</TableHead>
                <TableHead>Registered Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No registrations found
                  </TableCell>
                </TableRow>
              ) : (
                registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      {registration.user.name}
                    </TableCell>
                    <TableCell>{registration.user.email}</TableCell>
                    <TableCell>{registration.training.title}</TableCell>
                    <TableCell>
                      {format(new Date(registration.training.date), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(registration.registered_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={registration.status}
                        onValueChange={(value) => handleStatusChange(registration.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => handleDeleteClick(registration.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Registration
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Delete Confirmation Dialog - Outside the table to prevent conflicts */}
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
