// src/pages/CreateSelection.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSelection() {
  const [selected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    if (!name.trim()) return alert("Введите название подборки");

    const selections = JSON.parse(localStorage.getItem("selections") || "[]");
    const newSelection = {
      id: Date.now().toString(),
      name,
      apartmentIds: selected,
    };
    selections.push(newSelection);
    localStorage.setItem("selections", JSON.stringify(selections));

    navigate("/selections");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-6 pb-24">
        {/* Кнопка назад */}
        <button
          className="mb-4 text-blue-600 underline"
          onClick={() => navigate("/selections")}
        >
          ← Назад
        </button>

        <h1 className="text-2xl font-bold mb-4">Создать подборку</h1>
        <input
          type="text"
          placeholder="Название подборки"
          className="border p-2 rounded w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-4"></div>
      </div>

      {/* Sticky кнопка снизу */}
      <button
        className="sticky mx-auto bottom-4 w-11/12 px-4 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold"
        onClick={handleSave}
      >
        Сохранить подборку
      </button>
    </div>
  );
}
