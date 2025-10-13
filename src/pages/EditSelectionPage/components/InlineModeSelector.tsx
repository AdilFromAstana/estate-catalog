import { Building, Filter } from "lucide-react";
import type { SelectionMode } from "../EditSelectionPage";

interface InlineModeSelectorProps {
    mode: SelectionMode;
    setMode: (mode: SelectionMode) => void;
}



const InlineModeSelector: React.FC<InlineModeSelectorProps> = ({ mode, setMode }) => (
    <div className="flex items-center bg-gray-100 p-1 rounded-xl flex-shrink-0 w-full sm:w-auto">

        {/* Кнопка "Фильтры" */}
        <button
            onClick={() => setMode('filters')}
            className={` flex items-center px-3 py-1 rounded-lg text-xs font-semibold transition duration-200 flex-1 sm:flex-auto 
        ${mode === 'filters'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
        >
            <Filter className="w-3 h-3 mr-1.5" />
            По фильтрам
        </button>

        {/* Кнопка "Вручную" */}
        <button
            onClick={() => setMode('manual')}
            className={`
        flex items-center px-3 py-1 rounded-lg text-xs font-semibold transition duration-200 flex-1 sm:flex-auto
        ${mode === 'manual'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
        >
            <Building className="w-3 h-3 mr-1.5" />
            Вручную
        </button>
    </div>
);

export default InlineModeSelector