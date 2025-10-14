import { Building, ListFilter } from "lucide-react";
import type { SelectionMode } from "../EditSelectionPage";
import InlineModeSelector from "./InlineModeSelector";
import SelectionPropertiesTable from "./SelectionPropertiesTable";
import type { SelectedPropertyResponse } from "../../../types";

interface PropertyTableSectionProps {
    mode: SelectionMode;
    setMode: (mode: SelectionMode) => void;
    properties: SelectedPropertyResponse[];
    onToggleSelect: (id: number) => void;
    pagination: any;
    isLoading: boolean;
    totalSelectedCount: number;
}

const PropertyTableSection: React.FC<PropertyTableSectionProps> = ({ mode, setMode, properties, onToggleSelect, pagination, isLoading }) => {

    const isManualMode = mode === 'manual';

    // Формируем заголовок в зависимости от режима
    const titleText = `Результаты`;

    const Icon = isManualMode ? Building : ListFilter;

    return (
        <div className="space-y-4">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                {/* Динамический заголовок */}
                <h2 className="flex items-center text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
                    <Icon className="w-6 h-6 mr-3 text-indigo-600" /> {titleText}
                </h2>

                {/* Переключатель режимов справа */}
                <InlineModeSelector mode={mode} setMode={setMode} />
            </div>

            <SelectionPropertiesTable
                data={properties}
                selectable={isManualMode} // Чекбоксы только в ручном режиме
                onToggleSelect={onToggleSelect}
                pagination={pagination}
                isLoading={isLoading}
            />
        </div>
    );
};

export default PropertyTableSection