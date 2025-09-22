// src/components/Header.tsx
import { useState, type JSX } from "react";
import {
  Menu,
  X,
  LogOut,
  Key,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Header = () => {
  const nav = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { user } = useApp();

  return (
    <>
      <header className="w-full bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-screen-xl mx-auto flex px-4 py-3 justify-between items-center">
          <div
            className="text-xl font-bold text-blue-600 flex items-center gap-2 cursor-pointer"
            onClick={() => nav("/")}
          >
            <div>Juz realty</div>
          </div>

          <div className="flex items-center gap-4">
            {user?.isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 text-sm">
                <User size={16} className="text-gray-600" />
                <span className="text-gray-700">{user.name}</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                  {user.role === 'admin' ? 'Админ' :
                    user.role === 'realtor' ? 'Риэлтор' : 'Пользователь'}
                </span>
              </div>
            )}

            <button
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClose }) => {
  const nav = useNavigate();
  const { user, logout } = useApp();

  const handleNavigation = (path: string): void => {
    nav(path);
    onClose();
  };

  const handleLogout = (): void => {
    logout();
    onClose();
    nav("/");
  };

  const mainItems = [
    { id: "home", title: "Главная", path: "/", icon: Home },
    { id: "realtors", title: "Риэлторы", path: "/realtors", icon: Users },
    { id: "premium", title: "Премиум", path: "/premium", icon: Star },
    { id: "new-buildings", title: "Новостройки", path: "/new-buildings", icon: Building },
  ];

  const authItems = user?.isAuthenticated
    ? [
      { id: "favorites", title: "Избранное", path: "/favorites", icon: Heart },
      { id: "compare", title: "Сравнение", path: "/compare", icon: Grid3X3 },
      { id: "collections", title: "Коллекции", path: "/collections", icon: Layout },
    ]
    : [];

  const userItems = user?.isAuthenticated && (user.role === 'admin' || user.role === 'realtor')
    ? [
      { id: "add-property", title: "Добавить объект", path: "/add-property", icon: Plus },
      { id: "my-properties", title: "Мои объекты", path: "/my-properties", icon: Grid3X3 },
      { id: "statistics", title: "Статистика", path: "/statistics", icon: BarChart3 },
    ]
    : [];

  const renderNavItems = (items: any[]): JSX.Element[] => {
    return items.map((item) => {
      const IconComponent = item.icon;
      return (
        <li key={item.id}>
          <button
            onClick={() => handleNavigation(item.path)}
            className="w-full text-left flex items-center gap-3 p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <IconComponent size={20} />
            <span>{item.title}</span>
          </button>
        </li>
      );
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[39]" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Меню</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {renderNavItems(mainItems)}

            {authItems.length > 0 && (
              <>
                <li className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                    Личный кабинет
                  </h3>
                  {renderNavItems(authItems)}
                </li>
              </>
            )}

            {userItems.length > 0 && (
              <li className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  Для риэлторов
                </h3>
                {renderNavItems(userItems)}
              </li>
            )}

            <li className="border-t pt-4 mt-4">
              {user?.isAuthenticated ? (
                <div>
                  <div className="px-3 py-2 mb-2">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role === 'admin' ? 'Администратор' :
                        user.role === 'realtor' ? 'Риэлтор' : 'Пользователь'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Выход</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation("/login")}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Key size={20} />
                  <span>Вход</span>
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

// Импортируем иконки
import {
  Home,
  Users,
  Star,
  Building,
  Heart,
  Grid3X3,
  Plus,
  BarChart3,
  Layout
} from "lucide-react";

export default Header;