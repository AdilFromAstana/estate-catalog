const InputField: React.FC<{
  label: string;
  name: string;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled,
  required,
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : "focus:ring-blue-500 border-gray-300"
      }`}
    />
  </div>
);

export default InputField;
