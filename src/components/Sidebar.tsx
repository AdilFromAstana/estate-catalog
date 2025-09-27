// src/components/Sidebar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { LogOut, Key } from "lucide-react";
import {
  navigationItems,
  type NavigationItem,
} from "../contants/navigationItems";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Фильтрация пунктов по роли
  const filterNavItems = (section: "main" | "user"): NavigationItem[] => {
    return navigationItems.filter((item) => {
      if (!item.requiresAuth) {
        return item.section === section;
      }

      if (!user?.isAuthenticated || !user.roles?.length) {
        return false;
      }

      // Проверяем, есть ли у пользователя хотя бы одна из разрешённых ролей
      return (
        item.section === section &&
        item.roles.some((role) => user.roles.includes(role))
      );
    });
  };

  const mainNavItems = filterNavItems("main");
  // userNavItems можно убрать, если не используешь раздел "Для вас"

  return (
    <div className="w-64 text-white h-full flex flex-col bg-gray-800">
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {mainNavItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Блок профиля и выхода */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          {user?.isAuthenticated ? (
            <div className="space-y-3">
              <div className="px-4">
                <div className="text-sm font-medium text-white">
                  {user.name}
                </div>
                <div className="text-xs text-gray-400">
                  {user.roles.includes("admin")
                    ? "Суперадмин"
                    : user.roles.includes("agency_admin")
                    ? "Админ агентства"
                    : "Риелтор"}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-left text-red-400 hover:bg-red-600 hover:text-white transition-colors"
              >
                <LogOut size={20} />
                <span>Выход</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-2 rounded-md text-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Key size={20} />
              <span>Вход</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
