import type { PaginationState, Property } from "../EditSelectionPage";
import Pagination from "./Pagination";
import PropertyCheckbox from "./PropertyCheckbox";

const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString; // если не дата — вернём как есть

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};
// Функция форматирования цены
const formatPriceShort = (priceStr: string): string => {
    const num = parseFloat(priceStr.replace(/\s/g, '').replace('₸', ''));
    if (isNaN(num)) return priceStr;

    if (num >= 1_000_000) {
        const millions = num / 1_000_000;
        return `${millions % 1 === 0 ? Math.floor(millions) : millions.toFixed(1)}м`;
    }
    return priceStr;
};

interface SelectionPropertiesTableProps {
    data: Property[];
    selectable: boolean;
    onToggleSelect: (id: number) => void;
    pagination: PaginationState | null;
    isLoading: boolean;
}

const SelectionPropertiesTable: React.FC<SelectionPropertiesTableProps> = ({
    data,
    selectable,
    onToggleSelect,
    pagination,
    isLoading,
}) => {
    const handleToggle = (id: number) => {
        if (selectable && onToggleSelect) {
            onToggleSelect(id);
        }
    };

    const loadingOverlay = isLoading ? (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl z-10">
            <div className="text-indigo-600 font-semibold text-lg">Загрузка объектов...</div>
        </div>
    ) : null;

    if (!data || data.length === 0) {
        return (
            <div className="relative p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                {loadingOverlay}
                {!isLoading && 'Объекты не найдены.'}
            </div>
        );
    }

    return (
        <div className="relative">
            {loadingOverlay}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Десктопная Таблица */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                {selectable && <th className="pl-6 py-3 w-16"></th>}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/5">Объект и Адрес</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Цена</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Добавлен</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    {selectable && (
                                        <td className="pl-6 py-3">
                                            <PropertyCheckbox
                                                id={`prop-desk-${item.id}`}
                                                isSelected={item.selected}
                                                onChange={() => handleToggle(item.id)}
                                            />
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.photos?.[0] || "https://placehold.co/120x80?text=No+Image"}
                                                alt="preview"
                                                className="w-32 h-auto object-cover rounded"
                                            />
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-gray-800 truncate max-w-[300px]">
                                                    {item.title}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[250px]">
                                                    {item.address}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                                        {formatPriceShort(item.price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Мобильные Карточки */}
                <div className="md:hidden space-y-3">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-start bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition duration-150 ease-in-out"
                        >
                            {/* Чекбокс */}
                            {selectable && (
                                <div className="flex-shrink-0 pt-1 mr-3">
                                    <PropertyCheckbox
                                        id={`prop-mob-${item.id}`}
                                        isSelected={item.selected}
                                        onChange={() => handleToggle(item.id)}
                                    />
                                </div>
                            )}

                            {/* Контент карточки */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">
                                        {item.title}
                                    </div>
                                    <div className="ml-2 text-sm font-bold text-indigo-600 flex-shrink-0">
                                        {formatPriceShort(item.price)}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                                    {item.address}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Добавлен: {formatDate(item.createdAt)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Пагинация */}
            {pagination && (
                <Pagination
                    totalCount={pagination.totalCount}
                    pageSize={pagination.pageSize}
                    currentPage={pagination.currentPage}
                    onPageChange={pagination.onPageChange}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default SelectionPropertiesTable;