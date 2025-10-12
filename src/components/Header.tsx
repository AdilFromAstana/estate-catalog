// src/components/Header.tsx
import React, { useState, useMemo } from "react";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AppContext";
import { navigationItems } from "../contants/navigationItems";
import SafeImage from "./SafeImage";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  const userRoles = user?.roles?.map((r: any) => r.name) ?? [];

  const grouped = useMemo(() => {
    const allowed = navigationItems?.filter(
      (item) =>
        (!item.requiresAuth || user) &&
        (!item.roles.length ||
          item.roles.some((role) => userRoles.includes(role)))
    );

    return allowed.reduce<Record<string, typeof navigationItems>>(
      (acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
      },
      {}
    );
  }, [user, userRoles]);

  const groups = Object.keys(grouped);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div
          className="text-xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => nav("/")}
        >
          JUZ<span className="text-gray-700"> Real Estate</span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <div className="relative group">
              <SafeImage srcPath={user.avatar} size={40} />

              {/* Dropdown */}
              <div className="absolute right-0 mt-3 w-[450px] lg:w-[600px] bg-white rounded-2xl shadow-2xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top-right border border-gray-100">
                <div className="flex justify-between items-center p-4 border-b border-indigo-100 bg-indigo-50 rounded-t-2xl">
                  <div className="flex items-center">
                    <SafeImage srcPath={user.avatar} size={40} />
                    <div className="ml-3">
                      <p className="text-sm font-bold text-gray-800">
                        {user.firstName || "Профиль"}
                      </p>
                      <p className="text-xs text-indigo-600 capitalize">Роль</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center text-red-500 hover:text-red-700 transition-colors text-sm font-medium p-2 rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Выход
                  </button>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  {groups.map((groupName) => (
                    <div key={groupName} className="flex flex-col space-y-1">
                      <h4 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mt-2 mb-1 border-b border-indigo-100 pb-1">
                        {groupName}
                      </h4>
                      {grouped[groupName].map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => nav(item.path)}
                            className={`flex items-center p-2 rounded-lg transition-colors text-sm ${
                              item.path === groupName
                                ? "bg-indigo-100 text-indigo-700 font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <IconComponent size={20} />
                            {item.title}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => nav("/login")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              <LogIn className="w-5 h-5" />
              Войти
            </button>
          )}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          {groups.map((group) => (
            <div key={group} className="p-3 border-b last:border-none">
              <p className="text-xs font-semibold text-indigo-600 uppercase mb-2">
                {group}
              </p>
              {grouped[group].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      nav(item.path);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-md hover:bg-indigo-50 ${
                      location.pathname === item.path
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    <IconComponent size={20} />
                    {item.title}
                  </button>
                );
              })}
            </div>
          ))}
          {user ? (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left text-sm px-4 py-3 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Выйти
            </button>
          ) : (
            <button
              onClick={() => {
                nav("/login");
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left text-sm px-4 py-3 text-indigo-600 hover:bg-indigo-50"
            >
              <LogIn className="w-4 h-4" /> Войти
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
