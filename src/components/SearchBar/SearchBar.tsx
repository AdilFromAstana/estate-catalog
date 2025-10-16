import { Filter } from "lucide-react";
import FilterContent from "../FilterContent";
import { useEffect, useState } from "react";
import type { City, District, GetPropertiesParams } from "../../types";

interface SearchBarProps {
    onSearch: (query: string) => void;
    filters: GetPropertiesParams;
    onFilterChange: (key: keyof GetPropertiesParams, value: any) => void;
    onResetFilters: () => void;
    filterOptions: {
        cities: City[];
        districts: District[];
        maxPrice: number;
        minPrice: number;
        rooms: number[];
        minFloor: number | null;
        maxFloor: number | null;
    };
    filteredEstatesLength: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    filters,
    onFilterChange,
    onResetFilters,
    filterOptions,
    filteredEstatesLength,
}) => {
    const [value, setValue] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeSheet] = useState<keyof GetPropertiesParams | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onSearch(e.target.value);
    };

    useEffect(() => {
        if (isFilterOpen || activeSheet) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isFilterOpen, activeSheet]);

    return (
        <>
            {/* Поиск + кнопка фильтров */}
            <div className="w-full max-w-2xl mx-auto mb-4 flex gap-3">
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder="Поиск по району, улице или микрорайону..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                >
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:block">Фильтры</span>
                </button>
            </div>

            {/* Оверлей фильтров */}
            {isFilterOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black opacity-75 z-40"
                        onClick={() => setIsFilterOpen(false)}
                    />
                    <div className="fixed inset-0 z-50 flex justify-center items-center">
                        <div className="w-full h-full bg-white p-6 flex flex-col overflow-y-auto md:hidden">
                            <div className="flex justify-between items-center mb-6">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                                <h2 className="text-xl font-semibold">Фильтры</h2>
                                <button
                                    onClick={onResetFilters}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Сбросить всё
                                </button>
                            </div>
                            <FilterContent
                                onResetFilters={onResetFilters}
                                filters={filters}
                                onFilterChange={onFilterChange}
                                filterOptions={filterOptions}
                            />

                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors my-4"
                            >
                                Показать результаты ({filteredEstatesLength})
                            </button>
                        </div>

                        {/* Десктоп: по центру */}
                        <div className="hidden md:flex w-full max-w-lg h-[80vh] bg-white p-6 flex-col rounded-xl shadow-lg overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                                <h2 className="text-xl font-semibold">Фильтры</h2>
                                <button
                                    onClick={onResetFilters}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Сбросить всё
                                </button>
                            </div>
                            <FilterContent
                                onResetFilters={onResetFilters}
                                filters={filters}
                                onFilterChange={onFilterChange}
                                filterOptions={filterOptions}
                            />
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors my-4"
                            >
                                Показать результаты ({filteredEstatesLength})
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default SearchBar;