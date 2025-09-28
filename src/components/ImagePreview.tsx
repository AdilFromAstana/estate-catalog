import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export const ImagePreview: React.FC<{ images: string[] }> = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const closeModal = () => setIsOpen(false);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  // 🔹 Клавиатура + блокировка скролла
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!images?.length) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Импортированные изображения ({images.length})
      </label>

      {/* Мини-превью */}
      <div className="flex flex-wrap gap-2">
        {images.slice(0, 5).map((url, idx) => (
          <div
            key={idx}
            className="w-20 h-20 border rounded overflow-hidden cursor-pointer"
            onClick={() => {
              setCurrentIndex(idx);
              setIsOpen(true);
            }}
          >
            <img
              src={url}
              alt={`Импорт ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/80?text=Ошибка";
              }}
            />
          </div>
        ))}
        {images.length > 5 && (
          <div
            className="w-20 h-20 border rounded flex items-center justify-center text-xs text-gray-500 cursor-pointer"
            onClick={() => {
              setCurrentIndex(5);
              setIsOpen(true);
            }}
          >
            +{images.length - 5} ещё
          </div>
        )}
      </div>

      {/* Модалка */}
      {isOpen && (
        <>
          {/* Фон */}
          <div
            className="fixed inset-0 bg-black opacity-75 z-40"
            onClick={closeModal}
          />

          {/* Контент */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative flex items-center justify-center">
              {/* Закрыть */}
              <button
                onClick={closeModal}
                className="absolute top-1 right-1 text-white hover:text-gray-300 cursor-pointer"
              >
                <X size={32} />
              </button>

              {/* Стрелки */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer"
                  >
                    <ChevronLeft size={48} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-[-60px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer"
                  >
                    <ChevronRight size={48} />
                  </button>
                </>
              )}

              {/* Фото */}
              <img
                src={images[currentIndex]}
                alt={`image-${currentIndex}`}
                className="max-h-[90vh] min-h-[50vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
