import { Home, Car, PlusCircle, Heart, User } from "lucide-react";

const Footer = () => {
  return (
    <footer className="sticky bottom-0 left-0 w-full bg-white shadow-inner border-t z-50">
      <div className="flex justify-around py-2">
        <div className="flex flex-col items-center text-gray-700">
          <Home className="w-6 h-6" />
          <span className="text-xs">Главная</span>
        </div>
        <div className="flex flex-col items-center text-gray-700">
          <Car className="w-6 h-6" />
          <span className="text-xs">Каталог</span>
        </div>
        <div className="flex flex-col items-center text-blue-600">
          <PlusCircle className="w-8 h-8" />
          <span className="text-xs">Добавить</span>
        </div>
        <div className="flex flex-col items-center text-gray-700">
          <Heart className="w-6 h-6" />
          <span className="text-xs">Избранное</span>
        </div>
        <div className="flex flex-col items-center text-gray-700">
          <User className="w-6 h-6" />
          <span className="text-xs">Профиль</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
