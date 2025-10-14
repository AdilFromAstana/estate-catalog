import React from "react";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md">
        {/* Иконка: лупа с крестиком (символизирует "не найдено") */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Search className="w-12 h-12 text-indigo-600" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Страница не найдена
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Запрашиваемая страница не существует или была перемещена.
          Попробуйте вернуться на главную — оттуда вы точно найдёте нужное!
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Home className="w-4 h-4" />
          Вернуться на главную
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          Если вы считаете, что это ошибка — напишите нам.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;