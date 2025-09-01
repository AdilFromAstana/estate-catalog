// import { Heart, User } from "lucide-react";
import { HouseIcon } from "lucide-react";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate();
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50 overflow-hidden">
      <div className="max-w-screen-xl mx-auto flex px-4 py-3">
        {/* Логотип */}
        <div
          className="text-xl font-bold text-blue-600 flex items-center gap-2"
          onClick={() => nav("/")}
        >
          <div>Каталог</div>
          <HouseIcon />
        </div>

        {/* Иконки */}
        {/* <div className="flex items-center gap-4">
          <Heart className="w-6 h-6 text-gray-700" />
          <User className="w-6 h-6 text-gray-700" />
        </div> */}
      </div>
    </header>
  );
};

export default Header;
