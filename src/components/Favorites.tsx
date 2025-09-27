import type { FC } from "react";
// import EstateCard from "./EstateCard";
import type { Estate } from "../contants/estates";

interface FavoritesProps {
  estates: Estate[];
}

const Favorites: FC<FavoritesProps> = ({ estates }) => {
  if (estates.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-5">Избранных машин пока нет</p>
    );
  }

  return (
    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* {estates.map((car) => (
        <EstateCard key={car.id} {...car} />
      ))} */}
    </div>
  );
};

export default Favorites;
