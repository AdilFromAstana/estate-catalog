import React, { useEffect } from "react";

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  setCurrentIndex: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  onClose,
  setCurrentIndex,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const prev = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const next = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        ✕
      </button>
      <button className="absolute left-4 text-white text-3xl" onClick={prev}>
        ‹
      </button>
      <img
        src={images[currentIndex]}
        alt="Car"
        className="max-h-[80%] max-w-[90%] object-contain rounded-lg"
      />
      <button className="absolute right-4 text-white text-3xl" onClick={next}>
        ›
      </button>
    </div>
  );
};

export default ImageModal;
