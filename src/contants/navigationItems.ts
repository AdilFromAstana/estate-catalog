// src/contants/navigationItems.ts
import {
  Home,
  Building,
  User,
  Users,
  Settings,
  BarChart3,
  Plus,
  Landmark,
  Shield,
  List,
} from "lucide-react";

export type NavigationItem = {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<{ size?: number }>;
  section: "main" | "user";
  requiresAuth: boolean;
  group: string;
  roles: ("realtor" | "agency_admin" | "admin")[]; // ← роли, которым доступен пункт
};

export const navigationItems: NavigationItem[] = [
  // === Общие ===
  {
    id: "home",
    title: "Главная",
    path: "/",
    icon: Home,
    section: "main",
    group: "Общее",
    requiresAuth: false,
    roles: [],
  },

  // === Подборки ===
  {
    id: "add-selection",
    title: "Создать подборку",
    path: "/add-selection",
    icon: Plus,
    section: "main",
    group: "Подборки",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },
  {
    id: "selections-id",
    title: "Мои подборки",
    path: "/selections",
    icon: List,
    section: "main",
    group: "Подборки",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },

  // === Объекты ===
  {
    id: "add-property",
    title: "Добавить объект",
    path: "/add-property",
    icon: Plus,
    section: "main",
    group: "Объекты",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },
  {
    id: "my-properties",
    title: "Мои объекты",
    path: "/my-properties",
    icon: Building,
    section: "main",
    group: "Объекты",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },

  // === Настройки пользователя ===
  {
    id: "my-settings",
    title: "Мои настройки",
    path: "/my-settings",
    icon: User,
    section: "main",
    group: "Профиль",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },

  // === Агентство ===
  {
    id: "agency-realtors",
    title: "Риелторы агентства",
    path: "/realtors",
    icon: Users,
    section: "main",
    group: "Агентство",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },
  {
    id: "agency-properties",
    title: "Объекты агентства",
    path: "/agency-properties",
    icon: Building,
    section: "main",
    group: "Агентство",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },
  {
    id: "agency-selections",
    title: "Подборки агентства",
    path: "/agency-selections",
    icon: List,
    section: "main",
    group: "Агентство",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },
  {
    id: "agency-settings",
    title: "Настройки агентства",
    path: "/agency/settings",
    icon: Settings,
    section: "main",
    group: "Агентство",
    requiresAuth: true,
    roles: ["agency_admin", "admin"],
  },

  // === Админка ===
  {
    id: "all-agencies",
    title: "Все агентства",
    path: "/admin/agencies",
    icon: Landmark,
    section: "main",
    group: "Админка",
    requiresAuth: true,
    roles: ["admin"],
  },
  {
    id: "all-users",
    title: "Все пользователи",
    path: "/admin/users",
    icon: Users,
    section: "main",
    group: "Админка",
    requiresAuth: true,
    roles: ["admin"],
  },
  {
    id: "admin-settings",
    title: "Глобальные настройки",
    path: "/admin/settings",
    icon: Shield,
    section: "main",
    group: "Админка",
    requiresAuth: true,
    roles: ["admin"],
  },
  {
    id: "analytics",
    title: "Аналитика",
    path: "/admin/analytics",
    icon: BarChart3,
    section: "main",
    group: "Админка",
    requiresAuth: true,
    roles: ["admin"],
  },
];
