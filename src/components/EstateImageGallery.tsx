import React from "react";
import type { Estate } from "../contants/estates";

interface Props {
  estate: Estate;
  onImageClick: (index: number) => void;
}

const EstateImageGallery: React.FC<Props> = ({ estate, onImageClick }) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-3 grid-rows-2 gap-1 p-1 h-64">
        {/* Первое фото */}
        {estate.images[0] && (
          <img
            key={0}
            src={estate.images[0]}
            alt={`${estate.district} 1`}
            className="w-full h-full object-cover cursor-pointer col-span-2 row-span-2"
            onClick={() => onImageClick(0)}
          />
        )}

        {/* Второе фото */}
        {estate.images[1] && (
          <img
            key={1}
            src={estate.images[1]}
            alt={`${estate.district} 2`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onImageClick(1)}
          />
        )}

        {/* Третье фото */}
        {estate.images[2] && (
          <img
            key={2}
            src={estate.images[2]}
            alt={`${estate.district} 3`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onImageClick(2)}
          />
        )}
      </div>
      {estate.images.length > 4 && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => onImageClick(0)}
            className="bg-black/70 text-white px-3 py-1 rounded-full text-sm"
          >
            +{estate.images.length - 4} фото
          </button>
        </div>
      )}
    </div>
  );
};

export default EstateImageGallery;
