import { NavFooter } from '@/components/theme/nav-footer';
import { NavMain } from '@/components/theme/nav-main';
import { NavUser } from '@/components/theme/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, Folder, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

const getMainNavItems = (isAdmin: boolean): NavItem[] => {
    const baseItems: NavItem[] = [
        {
            title: 'Browse Trainings',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    if (isAdmin) {
        // Admin sees all trainings management
        return [
            ...baseItems,
            {
                title: 'Manage Registrations',
                href: '/manage-registrations',
                icon: Users,
            },
        ];
    } else {
        // Employees see their personal trainings
        return [
            ...baseItems,
            {
                title: 'My Trainings',
                href: '/my-trainings',
                icon: Calendar,
            },
        ];
    }
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/haraldsuurorg/training-app',
        icon: Folder,
    }
];

export function AppSidebar() {
    const { auth } = usePage().props as unknown as {
        auth: { user: { role: string } };
    };
    const isAdmin = auth.user.role === 'admin';
    const mainNavItems = getMainNavItems(isAdmin);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
