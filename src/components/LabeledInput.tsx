// components/ui/LabeledInput.tsx
import React from "react";
import type { LabeledInputProps } from "../types";

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  disabled,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        className={`text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"
          }`}
      >
        {label}
      </label>

      <input
        {...props}
        disabled={disabled}
        className={`border rounded-md px-3 py-2 outline-none w-full transition
          ${disabled
            ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed opacity-70"
            : "border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
      />
    </div>
  );
};
