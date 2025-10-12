import { useParams, Link } from "react-router-dom";
import { useState } from "react";

export default function SelectionDetail() {
  const { id } = useParams<{ id: string }>();
  const selections = JSON.parse(
    localStorage.getItem("selections") || "[]"
  ) as {
    id: string;
    name: string;
    apartmentIds: string[];
  }[];

  const selection = selections.find((c) => c.id === id);
  const [copied, setCopied] = useState(false);

  if (!selection) return <p className="p-6">Подборка не найдена</p>;

  // const selectedApartments = astanaEstates.filter((a) =>
  //   selection.apartmentIds.includes(a.id)
  // );

  const currentUrl = window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Ошибка копирования: ", err);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Link to="/selections" className="text-blue-600 underline">
        ← Назад
      </Link>
      <h1 className="text-2xl font-bold mt-4">{selection.name}</h1>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {/* {selectedApartments.map((a) => (
          <EstateCard key={a.id} {...a} />
        ))} */}
      </div>

      {/* Блок поделиться */}
      <div className="mt-10 sticky bottom-4">
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 w-full text-center"
          >
            {copied ? "Скопировано!" : "Скопировать ссылку"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full text-center"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
