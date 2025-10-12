// components/SafeImage.tsx
import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcPath?: string | null;
  fallbackEmpty?: string; // если фото вообще нет
  fallbackError?: string; // если ссылка есть, но ошибка загрузки
  size?: number;
}

const SafeImage: React.FC<SafeImageProps> = ({
  srcPath,
  fallbackEmpty = "https://placehold.co/96x96?text=No+Photo",
  fallbackError = "https://placehold.co/96x96?text=Image+Error",
  size = 96,
  alt = "Изображение",
  ...props
}) => {
  // Определяем начальный источник
  const initialSrc = srcPath ? `${API_URL}${srcPath}` : fallbackEmpty;
  const [src, setSrc] = useState(initialSrc);

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => {
        // Если уже fallbackEmpty — не нужно менять
        if (src === fallbackEmpty) return;
        // Ошибка загрузки -> fallbackError
        setSrc(fallbackError);
      }}
      className={`object-cover rounded-full border-2 border-gray-200 ${
        props.className || ""
      }`}
    />
  );
};

export default SafeImage;
