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
  roles: ("realtor" | "agency_admin" | "admin")[]; // ← роли, которым доступен пункт
};

export const navigationItems: NavigationItem[] = [
  // === Общие пункты (для всех авторизованных) ===
  {
    id: "/",
    title: "Главная",
    path: "/",
    icon: Home,
    section: "main",
    requiresAuth: false,
    roles: [],
  },

  // === Пункты для риелтора ===
  {
    id: "add-selection",
    title: "Создать подборку",
    path: "/add-selection",
    icon: List,
    section: "main",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },
  {
    id: "my-properties",
    title: "Мои объекты",
    path: "/my-properties",
    icon: Building,
    section: "main",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },
  {
    id: "my-settings",
    title: "Мои настройки",
    path: "/my-settings",
    icon: User,
    section: "main",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },
  {
    id: "add-property",
    title: "Добавить объект",
    path: "/add-property",
    icon: Plus,
    section: "main",
    requiresAuth: true,
    roles: ["realtor", "agency_admin", "admin"],
  },

  // === Пункты для админа агентства ===
  {
    id: "agency-realtors",
    title: "Риелторы агентства",
    path: "/realtors",
    icon: Users,
    section: "main",
    requiresAuth: true,
    roles: ["agency_admin", "admin"],
  },
  {
    id: "agency-properties",
    title: "Объекты агентства",
    path: "/agency-properties",
    icon: Building,
    section: "main",
    requiresAuth: true,
    roles: ["agency_admin", "admin"],
  },
  {
    id: "agency-settings",
    title: "Настройки агентства",
    path: "/agency/settings",
    icon: Settings,
    section: "main",
    requiresAuth: true,
    roles: ["agency_admin", "admin"],
  },

  // === Пункты для суперадмина ===
  {
    id: "all-agencies",
    title: "Все агентства",
    path: "/admin/agencies",
    icon: Landmark,
    section: "main",
    requiresAuth: true,
    roles: ["admin"],
  },
  {
    id: "all-users",
    title: "Все пользователи",
    path: "/admin/users",
    icon: Users,
    section: "main",
    requiresAuth: true,
    roles: ["admin"],
  },
  {
    id: "admin-settings",
    title: "Глобальные настройки",
    path: "/admin/settings",
    icon: Shield,
    section: "main",
    requiresAuth: true,
    roles: ["admin"],
  },
  {
    id: "analytics",
    title: "Аналитика",
    path: "/admin/analytics",
    icon: BarChart3,
    section: "main",
    requiresAuth: true,
    roles: ["admin"],
  },
];
