import React from "react";

const EstateContactButtons: React.FC = () => (
  <div className="mb-4 flex gap-2">
    <a
      href="tel:+77761156416"
      className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center transition"
    >
      Позвонить
    </a>
    <a
      href="https://wa.me/77761156416"
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 py-3 bg-[#25D366] text-white rounded-lg hover:bg-green-500 text-center transition"
    >
      WhatsApp
    </a>
  </div>
);

export default EstateContactButtons;
