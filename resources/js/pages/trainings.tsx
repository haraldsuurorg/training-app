import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { MyTrainingsCustomer } from '@/components/trainings/my-trainings-customer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainings',
        href: '/trainings',
    },
];

export default function Trainings() {
    const { registrations } = usePage().props as unknown as {
        registrations: any[];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <MyTrainingsCustomer registrations={registrations} />
            </div>
        </AppLayout>
    );
}
