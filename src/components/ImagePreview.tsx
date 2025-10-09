import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

interface Props {
  images: string[];
  onChange?: (newImages: string[]) => void; // callback для обновления списка
  allowEdit?: boolean; // режим добавления/удаления
}

export const ImagePreview: React.FC<Props> = ({
  images = [],
  onChange,
  allowEdit = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const closeModal = () => setIsOpen(false);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  // 🔹 Обработка клавиатуры и блокировка скролла
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

  // 🔹 Добавление новых изображений
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        newImages.push(base64);

        // обновляем после загрузки всех файлов
        if (newImages.length === files.length && onChange) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ""; // сбрасываем input
  };

  // 🔹 Удаление изображения
  const handleRemoveImage = (index: number) => {
    if (!onChange) return;
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  if (!images?.length && !allowEdit) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Изображения {images.length > 0 && `(${images.length})`}
      </label>

      <div className="flex flex-wrap gap-2">
        {/* 🔹 Мини-превью */}
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative group w-20 h-20 border rounded overflow-hidden cursor-pointer"
          >
            <img
              src={url}
              alt={`preview-${idx}`}
              className="w-full h-full object-cover"
              onClick={() => {
                setCurrentIndex(idx);
                setIsOpen(true);
              }}
            />

            {/* 🔹 Удалить */}
            {allowEdit && (
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        {/* 🔹 Кнопка добавления (если разрешено) */}
        {allowEdit && (
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddImages}
            />
            <Plus size={24} className="text-gray-500" />
          </label>
        )}
      </div>

      {/* 🔹 Модалка просмотра */}
      {isOpen && images.length > 0 && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-40"
            onClick={closeModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative flex items-center justify-center">
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-2 right-2 text-white hover:text-gray-300 cursor-pointer"
              >
                <X size={32} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer"
                    type="button"
                  >
                    <ChevronLeft size={48} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-[-60px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer"
                    type="button"
                  >
                    <ChevronRight size={48} />
                  </button>
                </>
              )}

              <img
                src={images[currentIndex]}
                alt={`image-${currentIndex}`}
                className="max-h-[70vh] min-h-[50vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
