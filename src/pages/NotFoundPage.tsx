import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold text-red-600">
        404 – Страница не найдена
      </h1>
      <Link to="/" className="mt-4 text-blue-600 underline">
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFoundPage;
