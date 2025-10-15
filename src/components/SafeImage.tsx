import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcPath?: string | null;
  fallbackEmpty?: string;
  fallbackError?: string;
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
  const initialSrc = srcPath ? `${API_URL}${srcPath}` : fallbackEmpty;
  const [src, setSrc] = useState(initialSrc);

  return (
    <div
      className="overflow-hidden rounded-full border-2 border-gray-200 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <img
        {...props}
        src={src}
        alt={alt}
        onError={() => {
          if (src === fallbackEmpty) return;
          setSrc(fallbackError);
        }}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default SafeImage;
