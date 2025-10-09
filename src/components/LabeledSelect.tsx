// components/ui/LabeledSelect.tsx
import React from "react";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
}

export const LabeledSelect: React.FC<Props> = ({
  label,
  options,
  disabled,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={`text-sm font-medium ${
          disabled ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <select
        {...props}
        disabled={disabled}
        className={`px-3 py-2 border rounded-md outline-none transition
          ${
            disabled
              ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed opacity-70"
              : "border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
      >
        <option value="">Выберите...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
