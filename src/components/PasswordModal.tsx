import React, { useEffect } from "react";

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (data: Record<string, FormDataEntryValue>) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSubmit }) => {
  // Закрытие по клавише Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay (фон) */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      ></div>

      {/* Модальное окно */}
      <div
        onClick={(e) => e.stopPropagation()} // не закрывать при клике внутри
        className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10 transform transition-all duration-300 animate-slideUp"
      >
        <h3 className="text-lg font-semibold mb-4">Смена пароля</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            onSubmit(data);
          }}
          className="space-y-4"
        >
          <Input
            label="Текущий пароль"
            name="currentPassword"
            type="password"
            required
          />
          <Input
            label="Новый пароль"
            name="newPassword"
            type="password"
            required
          />
          <Input
            label="Подтвердите новый пароль"
            name="confirmPassword"
            type="password"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default PasswordModal;
