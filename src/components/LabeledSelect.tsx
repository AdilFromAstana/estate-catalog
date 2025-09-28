// components/ui/LabeledSelect.tsx
import React from "react";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
}

export const LabeledSelect: React.FC<Props> = ({
  label,
  options,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        {...props}
        className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
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
