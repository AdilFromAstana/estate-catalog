import { Link } from "react-router-dom";

export default function SelectionsList() {
  const selections = JSON.parse(
    localStorage.getItem("selections") || "[]"
  ) as {
    id: string;
    name: string;
    apartmentIds: number[];
  }[];

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Подборки</h1>
      <Link
        to="/selections/create"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Создать подборку
      </Link>
      <div className="mt-6 space-y-4">
        {selections.length === 0 && <p>Пока нет подборок.</p>}
        {selections.map((c) => (
          <Link
            key={c.id}
            to={`/selections/${c.id}`}
            className="block p-4 border rounded-lg hover:bg-gray-50"
          >
            <h2 className="font-semibold">{c.name}</h2>
            <p className="text-sm text-gray-600">
              {c.apartmentIds.length} квартир
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
