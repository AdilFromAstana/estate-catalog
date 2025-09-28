// components/ui/LabeledTextarea.tsx
import React from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const LabeledTextarea: React.FC<Props> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        {...props}
        className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
};
