import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AppContext";
import { LogOut, Key, ChevronLeft, ChevronRight } from "lucide-react";
import {
  navigationItems,
  type NavigationItem,
} from "../contants/navigationItems";
import SafeImage from "./SafeImage";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const stored = localStorage.getItem("sidebarExpanded");
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  const userRoleNames = user?.roles?.map((r) => r.name) ?? [];

  const filterNavItems = (section: "main" | "user"): NavigationItem[] => {
    return navigationItems.filter((item) => {
      if (!item.requiresAuth) return item.section === section;
      if (!user || userRoleNames.length === 0) return false;
      return (
        item.section === section &&
        item.roles?.some((role) => userRoleNames.includes(role))
      );
    });
  };

  const mainNavItems = filterNavItems("main");

  const groupedItems = mainNavItems.reduce<Record<string, NavigationItem[]>>(
    (acc, item) => {
      if (!acc[item.group!]) acc[item.group!] = [];
      acc[item.group!].push(item);
      return acc;
    },
    {}
  );

  return (
    <aside
      className={`${
        isExpanded ? "w-64" : "w-20"
      } hidden lg:flex flex-col bg-gray-800 border-r border-gray-700 text-white transition-all duration-300 ease-in-out pt-16`}
    >
      {/* === Верхняя панель === */}
      <div className="flex items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-lg font-semibold text-white whitespace-nowrap"
        >
          {isExpanded ? (
            <span>
              <span className="text-blue-400">JUZ</span> - Real Estate
            </span>
          ) : (
            <span className="text-blue-400 text-xl font-bold">JZ</span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition ml-2"
          title={isExpanded ? "Свернуть" : "Развернуть"}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* === Навигация === */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-6">
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <div key={groupName}>
            {isExpanded && (
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
                {groupName}
              </p>
            )}
            <div className="space-y-1">
              {items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`group flex items-center gap-3 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    } ${isExpanded ? "px-4 py-2" : "justify-center py-3"}`}
                    title={!isExpanded ? item.title : ""}
                  >
                    <IconComponent size={20} />
                    {isExpanded && (
                      <span className="text-sm font-medium truncate">
                        {item.title}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* === Нижний блок === */}
      <div className="mt-auto border-t border-gray-700 p-3">
        {user ? (
          <div>
            <div
              className={`flex items-center ${
                isExpanded ? "gap-3" : "justify-center"
              } mb-3`}
            >
              <SafeImage srcPath={user?.avatar} size={16} />
              {isExpanded && (
                <div>
                  <div className="text-sm font-medium text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {userRoleNames.includes("admin")
                      ? "Суперадмин"
                      : userRoleNames.includes("agency_admin")
                      ? "Админ агентства"
                      : "Риелтор"}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full text-red-400 hover:bg-red-600 hover:text-white rounded-md transition ${
                isExpanded ? "px-4 py-2" : "justify-center py-3"
              }`}
              title={!isExpanded ? "Выход" : ""}
            >
              <LogOut size={20} />
              {isExpanded && <span>Выход</span>}
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className={`flex items-center gap-3 text-blue-200 hover:bg-blue-600 hover:text-white rounded-md transition ${
              isExpanded ? "px-4 py-2" : "justify-center py-3"
            }`}
          >
            <Key size={20} />
            {isExpanded && <span>Вход</span>}
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
