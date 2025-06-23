import AppLayout from '@/layouts/app-layout';
import { Training, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CreateTraining } from '@/components/trainings/create-training';
import { TrainingsList } from '@/components/trainings/trainings-list';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth, trainings } = usePage().props as unknown as {
        auth: { user: { role: string } };
        trainings: Training[];
    };
    const isAdmin = auth.user.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {isAdmin && (
                    <CreateTraining />
                )}
                <TrainingsList trainings={trainings} isAdmin={isAdmin} />
            </div>
        </AppLayout>
    );
}
