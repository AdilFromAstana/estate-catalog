import { FiltersContainer } from "./FiltersContainer";

export const CatalogDesktopFilters = ({
    selectedFilters,
    onFilterChange,
}: {
    selectedFilters: Record<string, number[]>;
    onFilterChange: (category: string, value: number) => void;
}) => {
    return (
        <div className="hidden md:block">
            <FiltersContainer
                selectedFilters={selectedFilters}
                onFilterChange={onFilterChange}
                displayMode="desktop"
            />
        </div>
    );
};
