// src/pages/RealtorEstates.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { getAvatar } from "../hooks/useRealtor";

export default function RealtorEstates() {
  const { id } = useParams<{ id: string }>();

  // Фейковые данные риэлторов (пока вручную)
  const fakeRealtors: Record<
    string,
    { name: string; phone: string; avatar: string }
  > = {
    "1": {
      name: "Айгуль Сапарова",
      phone: "+7 701 123 45 67",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    "2": {
      name: "Нурлан Ермеков",
      phone: "+7 702 987 65 43",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    "3": {
      name: "Мария Иванова",
      phone: "+7 705 555 11 22",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
  };

  const realtor = fakeRealtors[id ?? "1"];

  // Берём случайные 5 квартир
  // const shuffled = [...astanaEstates].sort(() => 0.5 - Math.random());
  // const selectedApartments = shuffled.slice(0, 5);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <Link to="/realtors" className="text-blue-600 underline">
        ← Назад к риэлторам
      </Link>

      {/* Блок риэлтора */}
      <div className="flex items-center gap-4 mt-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
        <img
          src={getAvatar(realtor?.avatar!)}
          alt={realtor?.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl font-bold">{realtor?.name}</h1>
          <p className="text-gray-600">Телефон: {realtor?.phone}</p>
        </div>
      </div>

      {/* Список квартир */}
      <h2 className="text-2xl font-semibold mt-8">Квартиры в продаже</h2>
      {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedApartments.map((a) => (
          <EstateCard key={a.id} {...a} />
        ))}
      </div> */}
    </div>
  );
}
