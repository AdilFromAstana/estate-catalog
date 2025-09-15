import type { Estate } from "../contants/estates";

type Props = {
  apartment: Estate;
  selected?: boolean;
  onToggle?: (id: string) => void;
};

export default function ApartmentCard({
  apartment,
  selected,
  onToggle,
}: Props) {
  const firstPhoto = apartment.images?.[0];

  return (
    <div
      className={`flex flex-col border rounded-lg cursor-pointer overflow-hidden ${
        selected ? "bg-blue-100 border-blue-500" : "bg-white"
      }`}
      onClick={() => onToggle?.(apartment.id)}
    >
      {firstPhoto ? (
        <img
          src={firstPhoto}
          alt={"Фото квартиры"}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
          Нет фото
        </div>
      )}
      <div className="p-4 flex flex-col gap-1">
        <h3 className="font-semibold text-lg">
          {apartment.roomCount}-комн. квартира
        </h3>
        <p className="text-gray-600">{apartment.price.toLocaleString()} ₸</p>
      </div>
    </div>
  );
}
