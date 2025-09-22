// src/components/Sidebar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { LogOut, Key } from "lucide-react";
import { navigationItems } from "../contants/navigationItems";

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useApp();

    const handleLogout = () => {
        logout();
        navigate("/"); // Перенаправляем на главную после выхода
    };

    // Фильтрация навигационных пунктов по авторизации и ролям
    const filterNavItems = (section: "main" | "user") => {
        return navigationItems
            .filter(item => item.section === section)
            .filter(item => !item.requiresAuth || user?.isAuthenticated)
            .filter(item => {
                if (!item.roles || !user?.role) return true;
                return item.roles.includes(user.role);
            });
    };

    const mainNavItems = filterNavItems("main");
    const userNavItems = filterNavItems("user");

    return (
        <div className="w-64 bg-gray-800 text-white h-full flex flex-col">
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
                                            : "hover:bg-gray-700 text-gray-200"
                                    }`}
                                >
                                    <IconComponent size={20} />
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Пользовательские пункты */}
                {user?.isAuthenticated && userNavItems.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                            Для вас
                        </h3>
                        <ul className="space-y-2">
                            {userNavItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <li key={item.id}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                                                location.pathname === item.path
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-gray-700 text-gray-200"
                                            }`}
                                        >
                                            <IconComponent size={20} />
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Блок авторизации/выхода */}
                <div className="mt-auto pt-4 border-t border-gray-700">
                    {user?.isAuthenticated ? (
                        <div className="space-y-2">
                            <div className="px-4 py-2">
                                <div className="text-sm font-medium text-white">{user.name}</div>
                                <div className="text-xs text-gray-400 capitalize">
                                    {user.role === 'admin' ? 'Администратор' : 
                                     user.role === 'realtor' ? 'Риэлтор' : 'Пользователь'}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-left hover:bg-red-600 transition-colors text-red-200 hover:text-white"
                            >
                                <LogOut size={20} />
                                <span>Выход</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-blue-200 hover:text-white"
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