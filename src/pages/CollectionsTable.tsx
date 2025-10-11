import React from "react";
import { Edit, Trash2, Share2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Agency {
  id: number;
  name: string;
}

interface UserType {
  id: number;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatar: string | null;
  agency: Agency;
}

interface Collection {
  id: number;
  name: string;
  description: string | null;
  isShared: boolean;
  createdAt: string;
  user: UserType;
}

interface Props {
  collections?: Collection[];
}

const CollectionsTable: React.FC<Props> = ({ collections }) => {
  const navigate = useNavigate();
  const handleEdit = (id: number) => navigate(`/edit-selection/${id}`);
  const data: Collection[] = collections || [
    {
      id: 2,
      name: "Трешки в Алматинском районе",
      description: "",
      isShared: true,
      createdAt: "2025-10-10T09:14:30.009Z",
      user: {
        id: 4,
        firstName: null,
        lastName: null,
        phone: null,
        avatar: null,
        agency: { id: 1, name: "JUZ RealEstate" },
      },
    },
    {
      id: 1,
      name: "Двушки в центре до 50 млн Астаны",
      description: null,
      isShared: false,
      createdAt: "2025-10-10T04:26:17.453Z",
      user: {
        id: 3,
        firstName: "Адиль",
        lastName: "Айжанов",
        phone: "+77761156416",
        avatar: "/uploads/avatars/15150287-8c2c-44ac-baeb-2f92ee7da4d7.webp",
        agency: { id: 1, name: "JUZ RealEstate" },
      },
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Подборки ({data.length} из {data.length})
        </h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Добавить подборку
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Название</th>
              <th className="px-4 py-3 font-medium">Описание</th>
              <th className="px-4 py-3 font-medium">Автор</th>
              <th className="px-4 py-3 text-center font-medium">Общая</th>
              <th className="px-4 py-3 text-center font-medium">Создана</th>
              <th className="px-4 py-3 text-right font-medium">Действия</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                {/* Название */}
                <td className="px-4 py-3 font-semibold">{item.name}</td>

                {/* Описание */}
                <td className="px-4 py-3 text-gray-500">
                  {item.description || "—"}
                </td>

                {/* Автор */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {item.user.avatar ? (
                      <img
                        src={item.user.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {item.user.firstName || "Без имени"}{" "}
                        {item.user.lastName || ""}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.user.agency?.name}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Общая */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isShared
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.isShared ? "Да" : "Нет"}
                  </span>
                </td>

                {/* Дата */}
                <td className="px-4 py-3 text-center text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                </td>

                {/* Действия */}
                <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                  <button
                    className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                    onClick={() => handleEdit(item.id)}
                  >
                    <Edit size={16} />
                  </button>
                  <button className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition">
                    <Trash2 size={16} />
                  </button>
                  <button className="p-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition">
                    <Share2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CollectionsTable;
