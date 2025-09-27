import type { FC } from "react";
// import EstateCard from "./EstateCard";
import type { Estate } from "../contants/estates";

interface EstateListProps {
  estates: Estate[];
}

const EstateList: FC<EstateListProps> = ({ estates }) => {
  if (estates.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-5">Нет доступных машин</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-3">
      {/* {estates.map((estate) => (
        <EstateCard key={estate.id} {...estate} />
      ))} */}
    </div>
  );
};

export default EstateList;
