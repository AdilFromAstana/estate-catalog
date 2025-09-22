import React from "react";

const EstateContactButtons: React.FC = () => (
  <div className="mb-4 grid grid-cols-2 gap-2">
    <a
      href="tel:+77761156416"
      className="py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center transition"
    >
      Позвонить
    </a>
    <a
      href="https://wa.me/77761156416"
      target="_blank"
      rel="noopener noreferrer"
      className="py-3 bg-[#25D366] text-white rounded-lg hover:bg-green-500 text-center transition"
    >
      WhatsApp
    </a>
    <a
      href="https://instagram.com/your_instagram"
      target="_blank"
      rel="noopener noreferrer"
      className="py-3 bg-[#E4405F] text-white rounded-lg hover:bg-pink-600 text-center transition"
    >
      Instagram
    </a>
    <a
      href="https://tiktok.com/@your_tiktok"
      target="_blank"
      rel="noopener noreferrer"
      className="py-3 bg-[#000000] text-white rounded-lg hover:bg-gray-800 text-center transition"
    >
      TikTok
    </a>
  </div>
);

export default EstateContactButtons;
