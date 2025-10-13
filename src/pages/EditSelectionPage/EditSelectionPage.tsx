// EditSelectionPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderSection from './components/HeaderSection';
import EditDetailsForm from './components/EditDetailsForm';
import MobileFilterToggle from './components/MobileFilterToggle';
import PropertyTableSection from './components/PropertyTableSection';
import SaveButtonStickyFooter from './components/SaveButtonStickyFooter';
import type { GetPropertiesParams } from '../../api/propertyApi';
import { useCities, useDistricts } from '../../hooks/useCities';
import { useProperties } from '../../hooks/useProperties';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { selectionApi } from '../../api/selectionApi';
import { toast } from 'react-hot-toast';
import { FilterContent } from '../../components/SearchBar';
import { useSelection } from '../../hooks/useSelection';

// Типы
export interface SelectionDetails {
  title: string;
  description: string;
  isPublic: boolean;
}

export type SelectionMode = 'filters' | 'manual';

const PAGINATION_SIZE = 10;

const EditSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const selectionId = id ? parseInt(id, 10) : null;

  // === Загрузка подборки ===
  const { data: selectionData, isLoading: isSelectionLoading } = useSelection(selectionId!);
  const isInitialLoading = isSelectionLoading && !selectionData;

  // === Состояния ===
  const [mode, setMode] = useState<SelectionMode>('filters');
  const [selectionDetails, setSelectionDetails] = useState<SelectionDetails>({
    title: '',
    description: '',
    isPublic: false,
  });
  const [filters, setFilters] = useState<GetPropertiesParams>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [allSelectedIds, setAllSelectedIds] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const totalSelectedCount = mode === 'filters'
    ? (selectionData?.properties?.total ?? 0)
    : allSelectedIds.size;
  const isDisabled = !selectionDetails.title.trim();

  // === Инициализация из API ===
  useEffect(() => {
    if (selectionData) {
      const { selection, type } = selectionData;

      setSelectionDetails({
        title: selection.name || '',
        description: selection.description || '',
        isPublic: selection.isShared || false,
      });

      const newMode: SelectionMode = type === 'byFilters' ? 'filters' : 'manual';
      setMode(newMode);

      if (newMode === 'filters' && selection.filters) {
        setFilters(selection.filters);
      } else {
        setFilters({});
      }

      if (newMode === 'manual' && Array.isArray(selection.propertyIds)) {
        setAllSelectedIds(new Set(selection.propertyIds));
      } else {
        setAllSelectedIds(new Set());
      }
    }
  }, [selectionData]);

  // === Города и районы ===
  const { data: cities = [] } = useCities();
  const { data: districts = [] } = useDistricts(filters.cityId ?? undefined);

  // === Запрос объектов ===
  const queryParams = useMemo(() => {
    if (mode === 'filters') {
      return {
        ...filters,
        page: 1,
        limit: PAGINATION_SIZE,
        isPublished: true,
      };
    } else {
      return {
        page: 1,
        limit: PAGINATION_SIZE,
        isPublished: true,
      };
    }
  }, [mode, filters]);

  const { data: propertiesData, isLoading: isPropertiesLoading } = useProperties(queryParams);
  const properties = propertiesData?.data ?? [];
  const totalCount = propertiesData?.total ?? 0;

  // === Мутация обновления ===
  const updateMutation = useMutation({
    mutationFn: (payload: any) => selectionApi.updateSelection(selectionId!, payload),
    onSuccess: () => {
      toast.success('Подборка успешно обновлена!');
      queryClient.invalidateQueries({ queryKey: ['selection', selectionId] });
      queryClient.invalidateQueries({ queryKey: ['selections'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Ошибка при сохранении');
    },
  });

  // === Обработчики ===
  const handleSetMode = useCallback((newMode: SelectionMode) => {
    setMode(newMode);
    if (newMode === 'manual') {
      setFilters({});
      setAllSelectedIds(new Set());
    }
  }, []);

  const handleFilterChange = useCallback((key: keyof GetPropertiesParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleToggleSelect = useCallback((id: number) => {
    setAllSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, []);

  const handleDetailsChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSelectionDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSave = () => {
    if (isDisabled || !selectionId) return;

    setIsSaving(true);
    const payload =
      mode === 'filters'
        ? {
          name: selectionDetails.title,
          description: selectionDetails.description,
          isShared: selectionDetails.isPublic,
          filters,
        }
        : {
          name: selectionDetails.title,
          description: selectionDetails.description,
          isShared: selectionDetails.isPublic,
          propertyIds: Array.from(allSelectedIds),
        };

    updateMutation.mutate(payload, {
      onSettled: () => setIsSaving(false),
    });
  };

  // === Подготовка данных для таблицы ===
  const propertiesWithSelection = useMemo(() => {
    return properties.map(prop => ({
      ...prop,
      selected: allSelectedIds.has(prop.id),
    }));
  }, [properties, allSelectedIds]);

  const paginationProps = {
    totalCount,
    pageSize: PAGINATION_SIZE,
    currentPage: 1,
    onPageChange: () => { },
    isLoading: isPropertiesLoading,
  };

  const filterOptions = {
    cities,
    districts,
    maxPrice: 200_000_000,
    rooms: [1, 2, 3, 4, 5],
    minFloor: 1,
    maxFloor: 30,
  };

  // === Загрузка и ошибки ===
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка подборки...</div>
      </div>
    );
  }

  if (!selectionData || !selectionId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Подборка не найдена
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full mx-auto">
      <HeaderSection
        title="Редактировать подборку"
        onSave={handleSave}
        isSaving={isSaving}
        isDisabled={isDisabled}
      />

      <div className="space-y-6 md:space-y-8 mt-6">
        <EditDetailsForm
          data={selectionDetails}
          handleChange={handleDetailsChange}
        />

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 mt-6 md:mt-8">
          <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
            <MobileFilterToggle
              isFiltersOpen={isFiltersOpen}
              setIsFiltersOpen={setIsFiltersOpen}
            />

            <PropertyTableSection
              mode={mode}
              setMode={handleSetMode}
              properties={propertiesWithSelection}
              onToggleSelect={handleToggleSelect}
              pagination={paginationProps}
              isLoading={isPropertiesLoading}
              totalSelectedCount={totalSelectedCount}
            />
          </div>

          <div className={`lg:col-span-4 space-y-6 order-2 lg:order-1 mt-6 lg:mt-0 
              ${isFiltersOpen ? 'block' : 'hidden'} lg:block`
          }>
            <FilterContent
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              filterOptions={filterOptions}
            />
          </div>
        </div>
      </div>

      <SaveButtonStickyFooter
        onSave={handleSave}
        isDisabled={isDisabled}
        isSaving={isSaving}
      />
    </div>
  );
};

export default EditSelectionPage;