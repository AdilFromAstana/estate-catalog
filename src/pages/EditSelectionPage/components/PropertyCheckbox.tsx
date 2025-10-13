interface PropertyCheckboxProps {
    id: string; // Используем string для HTML ID
    isSelected: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertyCheckbox: React.FC<PropertyCheckboxProps> = ({ id, isSelected, onChange }) => (
    <input
        type="checkbox"
        id={id}
        checked={isSelected}
        onChange={onChange}
        className="
      cursor-pointer text-indigo-600 bg-gray-100 border-gray-300 rounded transition duration-150 ease-in-out
      w-4 h-4 md:w-5 md:h-5 
      focus:ring-indigo-500
    "
    />
);
export default PropertyCheckbox