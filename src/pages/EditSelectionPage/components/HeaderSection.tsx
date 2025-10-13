import { Building, Save } from "lucide-react";

interface HeaderSectionProps {
    onSave: () => void;
    isSaving: boolean;
    isDisabled: boolean;
    title: string
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ onSave, isSaving, isDisabled, title }) => (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="mb-4 md:mb-0">
            <h1 className="flex items-center text-3xl font-extrabold text-gray-800">
                <span className="mr-2">{title}</span>
                <span className="text-indigo-600">
                    <Building className="w-8 h-8" />
                </span>
            </h1>
            <p className="mt-1 text-base text-gray-500">
                Настройте параметры и фильтры для обновления подборки.
            </p>
        </div>
        <button
            onClick={onSave}
            disabled={isDisabled || isSaving}
            className={`
        hidden md:block px-6 py-3 rounded-xl text-lg font-semibold transition duration-200 ease-in-out shadow-lg
        ${isDisabled || isSaving
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
        >
            <span className="flex items-center justify-center">
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </span>
        </button>
    </div>
);

export default HeaderSection