// components/ui/LabeledInput.tsx
import React from "react";

interface LabeledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full"
      />
    </div>
  );
};
