import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Training {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    max_participants: number;
    registrations_count?: number;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Registration {
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

export interface RegistrationData {
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
