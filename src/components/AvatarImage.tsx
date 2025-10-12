import React, { useEffect, useState } from "react";
import { getAvatar } from "../hooks/useRealtor";

const AvatarImage: React.FC<{ avatarPath?: string }> = ({ avatarPath }) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    getAvatar(avatarPath).then(setSrc);
  }, [avatarPath]);

  return (
    <img
      src={src}
      alt="Аватар"
      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
    />
  );
};
export default AvatarImage;
