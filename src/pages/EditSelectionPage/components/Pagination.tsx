import { ChevronLeft, ChevronRight } from "lucide-react";
import { type SelectionMode } from "../EditSelectionPage";


interface PaginationProps {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number, mode: SelectionMode) => void;
    isLoading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ totalCount, pageSize, currentPage, onPageChange, isLoading }) => {
    const totalPages = Math.ceil(totalCount / pageSize);

    if (totalCount <= pageSize) return null;

    const handlePrev = () => {
        if (currentPage > 1 && !isLoading) {
            onPageChange(currentPage - 1, 'filters');
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages && !isLoading) {
            onPageChange(currentPage + 1, 'filters');
        }
    };

    const pageDisplay = `Страница ${currentPage} из ${totalPages.toLocaleString('ru-RU')}`;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
            <p className="text-sm text-gray-700 font-medium mb-2 sm:mb-0">
                Показано {Math.min(currentPage * pageSize, totalCount).toLocaleString('ru-RU')} объектов
            </p>
            <div className="flex items-center space-x-2">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1 || isLoading}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 py-1 text-sm font-semibold text-gray-700">
                    {pageDisplay}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage >= totalPages || isLoading}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination