// components/ui/LabeledTextarea.tsx
import React, { useEffect, useRef } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const LabeledTextarea: React.FC<Props> = ({
  label,
  disabled,
  value,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 🔹 Автоматическое изменение высоты при вводе
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto"; // сбрасываем
    el.style.height = `${el.scrollHeight}px`; // выставляем реальную высоту
  }, [value]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        className={`text-sm font-medium ${
          disabled ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {label}
      </label>

      <textarea
        ref={textareaRef}
        value={value}
        disabled={disabled}
        {...props}
        rows={1} // базовая высота
        className={`px-3 py-2 border rounded-md outline-none transition w-full resize-none overflow-hidden
          ${
            disabled
              ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed opacity-70"
              : "border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
      />
    </div>
  );
};
