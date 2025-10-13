import { Filter } from "lucide-react";

interface MobileFilterToggleProps {
    isFiltersOpen: boolean;
    setIsFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileFilterToggle: React.FC<MobileFilterToggleProps> = ({ isFiltersOpen, setIsFiltersOpen }) => {
    // Эта кнопка видна только на экранах < 1024px (lg breakpoint)
    return (
        <div className="lg:hidden">
            <button
                onClick={() => setIsFiltersOpen(prev => !prev)}
                className="w-full flex items-center justify-center p-3 border border-indigo-200 bg-white text-indigo-600 rounded-xl font-semibold shadow-sm hover:bg-indigo-50 transition"
            >
                <Filter className="w-5 h-5 mr-2" />
                {isFiltersOpen ? 'Скрыть настройки фильтров' : 'Показать настройки фильтров'}
            </button>
        </div>
    );
};
export default MobileFilterToggle