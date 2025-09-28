import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Estate } from "../contants/estates";

interface EstateCarouselProps {
  estates: Estate[];
  title: string;
}

const EstateCarousel: React.FC<EstateCarouselProps> = ({ estates, title }) => {
  const navigate = useNavigate();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (estates.length === 0) return null;

  return (
    <div className="mt-8">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            aria-label="Предыдущие"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            aria-label="Следующие"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {estates.map((estate) => (
            <div
              key={estate.id}
              onClick={() => navigate(`/estate/${estate.id}`)}
              className="flex-none w-[280px] snap-start cursor-pointer group"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={estate.photos[0] || "/placeholder-estate.jpg"}
                    alt={estate.district}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Price overlay */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/80 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                      {estate.price.toLocaleString()} ₸
                    </span>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-800">
                      {estate.roomCount}-комн.
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
                    {estate.district}, {estate.city}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <span>{estate.totalArea} м²</span>
                    <span>•</span>
                    <span>
                      {estate.floor}/{estate.totalFloors} эт.
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="truncate">
                      {estate.microdistrict || estate.street}
                    </span>
                  </div>

                  {/* Price per square */}
                  {estate.pricePerSquare && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        {Math.round(estate.pricePerSquare).toLocaleString()}{" "}
                        ₸/м²
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient fade edges */}
        {/* <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" /> */}
      </div>
    </div>
  );
};

// CSS for hiding scrollbar
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Add styles to document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default EstateCarousel;
