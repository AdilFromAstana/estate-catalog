// src/contants/navigationItems.ts
import {
    Home,
    Heart,
    Grid3X3,
    Users,
    Plus,
    BarChart3,
    Building,
    Star,
    Layout,
    Grid
} from "lucide-react";
import type { UserRole } from "../types/auth";

export interface NavigationItem {
    id: string;
    title: string;
    path: string;
    icon: React.ComponentType<{ size?: number }>;
    section: "main" | "user";
    requiresAuth?: boolean;
    roles?: UserRole[];
}

export const navigationItems: NavigationItem[] = [
    // Основные пункты
    {
        id: "home",
        title: "Главная",
        path: "/",
        icon: Home,
        section: "main"
    },
    {
        id: "collage",
        title: "Коллаж",
        path: "/collage",
        icon: Grid,
        section: "main",
        requiresAuth: true
    },
    {
        id: "favorites",
        title: "Избранное",
        path: "/favorites",
        icon: Heart,
        section: "main",
        requiresAuth: true
    },
    {
        id: "compare",
        title: "Сравнение",
        path: "/compare",
        icon: Grid3X3,
        section: "main",
        requiresAuth: true
    },
    {
        id: "collections",
        title: "Коллекции",
        path: "/collections",
        icon: Layout,
        section: "main",
        requiresAuth: true
    },
    {
        id: "premium",
        title: "Премиум",
        path: "/premium",
        icon: Star,
        section: "main"
    },
    {
        id: "new-buildings",
        title: "Новостройки",
        path: "/new-buildings",
        icon: Building,
        section: "main"
    },

    // Пользовательские пункты (только для авторизованных)
    {
        id: "realtors",
        title: "Риэлторы",
        path: "/realtors",
        icon: Users,
        section: "main",
        roles: ["admin"]
    },
    {
        id: "add-property",
        title: "Добавить объект",
        path: "/add-property",
        icon: Plus,
        section: "user",
        requiresAuth: true,
        roles: ["admin", "realtor"]
    },
    {
        id: "my-properties",
        title: "Мои объекты",
        path: "/my-properties",
        icon: Grid3X3,
        section: "user",
        requiresAuth: true,
        roles: ["admin", "realtor"]
    },
    {
        id: "statistics",
        title: "Статистика",
        path: "/statistics",
        icon: BarChart3,
        section: "user",
        requiresAuth: true,
        roles: ["admin"]
    }
];