import { useState, type JSX } from "react";
import {
  House,
  Menu,
  X,
  User,
  Heart,
  LogOut,
  Key,
  Building,
  Star,
  Plus,
  HomeIcon,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";

interface NavigationItem {
  id: number;
  title: string;
  path: string;
  icon: LucideIcon;
  section: "main" | "auth" | "user";
  requiresAuth?: boolean;
}

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
      <header className="w-full bg-white shadow-md sticky top-0 z-50 overflow-hidden">
        <div className="max-w-screen-xl mx-auto flex px-4 py-3 justify-between items-center">
          <div
            className="text-xl font-bold text-blue-600 flex items-center gap-2 cursor-pointer"
            onClick={() => nav("/")}
          >
            <div>Каталог недвижимости</div>
            <House size={20} />
          </div>

          <div className="flex items-center gap-4">
            {user?.isAuthenticated && (
              <button
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => nav("/add-property")}
                title="Добавить объект"
              >
                <Plus size={20} className="text-green-600" />
              </button>
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

  const navigationItems: NavigationItem[] = [
    {
      id: 1,
      title: "Главная",
      path: "/",
      icon: House,
      section: "main",
    },
    {
      id: 2,
      title: "Риэлторы",
      path: "/realtors",
      icon: User,
      section: "main",
    },
    {
      id: 3,
      title: "Подборки",
      path: "/collections",
      icon: Heart,
      section: "main",
    },
    {
      id: 4,
      title: "Премиум объекты",
      path: "/premium",
      icon: Star,
      section: "main",
    },
    {
      id: 5,
      title: "Новостройки",
      path: "/new-buildings",
      icon: Building,
      section: "main",
    },
    {
      id: 6,
      title: "Моя недвижимость",
      path: "/my-properties",
      icon: HomeIcon,
      section: "main",
      requiresAuth: false,
    },
    {
      id: 7,
      title: "Добавить объект",
      path: "/add-property",
      icon: Plus,
      section: "main",
      requiresAuth: false,
    },
  ];

  const handleNavigation = (path: string): void => {
    nav(path);
    onClose();
  };

  const handleLogout = (): void => {
    logout();
    onClose();
    nav("/");
  };

  const renderNavItems = (items: NavigationItem[]): JSX.Element[] => {
    return items
      .filter((item) => !item.requiresAuth || user?.isAuthenticated)
      .map((item) => {
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

  const mainItems = navigationItems.filter((item) => item.section === "main");
  const userItems = navigationItems.filter((item) => item.section === "user");

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
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

            {user?.isAuthenticated && userItems.length > 0 && (
              <li className="border-t pt-4 mt-4">
                {renderNavItems(userItems)}
              </li>
            )}

            <li className="border-t pt-4 mt-4">
              {user?.isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Выход</span>
                </button>
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

export default Header;
