import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { TrainingsList } from '@/components/trainings/trainings-list';
import { Registration, Training } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Trainings',
        href: '/my-trainings',
    },
];

export default function MyTrainings() {
    const { registrations } = usePage().props as unknown as {
        registrations: Registration[];
    };

    // Transform registrations to trainings format with registration info
    const myTrainings: (Training & { registrationId: number; registeredAt: string })[] = registrations.map(registration => ({
        ...registration.training,
        registrationId: registration.id,
        registeredAt: registration.registered_at,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Trainings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className="text-2xl font-bold mb-4">My Registered Trainings</h1>
                {registrations.length === 0 ? (
                    <div className="text-center py-8">
                        <h2 className="text-lg font-semibold mb-2">No Registered Trainings</h2>
                        <p className="text-muted-foreground">You haven't registered for any trainings yet.</p>
                    </div>
                ) : (
                    <TrainingsList trainings={myTrainings} isAdmin={false} />
                )}
            </div>
        </AppLayout>
    );
} 