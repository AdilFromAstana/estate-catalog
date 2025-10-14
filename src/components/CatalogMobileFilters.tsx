import { FiltersContainer } from "./FiltersContainer";

export const CatalogMobileFilters = ({
    selectedFilters,
    onFilterChange,
}: {
    selectedFilters: Record<string, number[]>;
    onFilterChange: (category: string, value: number) => void;
}) => {
    return (
        <div className="block md:hidden">
            <FiltersContainer
                selectedFilters={selectedFilters}
                onFilterChange={onFilterChange}
                displayMode="mobile"
            />
        </div>
    );
};
