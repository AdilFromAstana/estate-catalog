import { Filter, X } from "lucide-react";

interface FilterSectionProps {
    isMobile: boolean;
    onClose: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ isMobile, onClose }) => (
    <div className="space-y-4">
        {isMobile && (
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <h2 className="flex items-center text-xl font-semibold text-gray-800">
                    <Filter className="w-5 h-5 mr-2 text-indigo-600" /> Настройка фильтров
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <p className="text-sm text-gray-500 border-b pb-3 mb-3">
                В реальном приложении эти фильтры отправляют запрос на сервер для обновления подборки.
            </p>
            <div className="grid grid-cols-1 gap-4">
                {['Город', 'Район', 'Цена (от-до)', 'Площадь', 'Этаж', 'Комнаты'].map((label) => (
                    <div key={label}>
                        <label className="block text-sm font-medium text-gray-700">{label}</label>
                        <input
                            type="text"
                            placeholder={`Укажите ${label.toLowerCase()}`}
                            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                ))}
            </div>
            <div className="pt-2">
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                    Применить фильтры
                </button>
            </div>
        </div>
    </div>
);

export default FilterSection