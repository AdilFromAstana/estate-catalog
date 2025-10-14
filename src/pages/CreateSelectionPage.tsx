import React, { useState, useCallback, useMemo } from 'react';
import { FilterContent } from '../components/SearchBar';

// Хуки и API
import { useCities, useDistricts } from '../hooks/useCities';
import { useProperties } from '../hooks/useProperties';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { selectionApi } from '../api/selectionApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import HeaderSection from './EditSelectionPage/components/HeaderSection';
import EditDetailsForm from './EditSelectionPage/components/EditDetailsForm';
import MobileFilterToggle from './EditSelectionPage/components/MobileFilterToggle';
import PropertyTableSection from './EditSelectionPage/components/PropertyTableSection';
import SaveButtonStickyFooter from './EditSelectionPage/components/SaveButtonStickyFooter';
import type { GetPropertiesParams, SelectionDetails, SelectionMode } from '../types';

const PAGINATION_SIZE = 10;
// const TOTAL_MOCK_COUNT = 1_000_000; // ❌ УДАЛЕНА СТАТИЧНАЯ ЗАГЛУШКА

const CreateSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // === 1. Основные состояния ===
  const [mode, setMode] = useState<SelectionMode>('filters');
  const [selectionDetails, setSelectionDetails] = useState<SelectionDetails>({
    title: '',
    description: '',
    isPublic: false,
  });
  const [filters, setFilters] = useState<GetPropertiesParams>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // === 2. Состояние пагинации и выбора ===
  const [currentPage, setCurrentPage] = useState(1);
  const [allSelectedIds, setAllSelectedIds] = useState<Set<number>>(new Set());
  const totalSelectedCount = allSelectedIds.size;

  // === 3. Сохранение ===
  const [isSaving, setIsSaving] = useState(false);

  const isDisabled = useMemo(() => {
    if (!selectionDetails.title.trim()) return true;

    if (mode === 'filters') {
      const hasFilter = Object.values(filters).some(
        v => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
      );
      return !hasFilter;
    }

    if (mode === 'manual') {
      return totalSelectedCount === 0;
    }
    return true;
  }, [selectionDetails.title, mode, filters, totalSelectedCount]);

  // === Города и районы ===
  const { data: cities = [] } = useCities();
  const { data: districts = [] } = useDistricts(filters.cityId ?? undefined);

  // === 4. Параметры запроса (Динамические) ===
  const queryParams = useMemo(() => {
    return {
      ...filters,
      page: currentPage,
      limit: PAGINATION_SIZE,
      isPublished: true,
    };
  }, [filters, currentPage]);

  // === Запрос данных ===
  const { data, isLoading } = useProperties(queryParams);
  const properties = data?.data ?? [];

  // 👈 ИСПРАВЛЕНО: totalCount берется из данных или равен 0
  const totalCount = data?.total ?? 0;

  // === Мутация создания ===
  const createMutation = useMutation({
    mutationFn: (payload: any) => selectionApi.createSelection(payload),
    onSuccess: () => {
      toast.success('Подборка успешно создана!');
      queryClient.invalidateQueries({ queryKey: ['selections'] });
      navigate('/selections');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Ошибка при создании');
    },
  });

  // === 5. Обработчик смены страницы (для Pagination) ===
  const handlePageChange = useCallback((newPage: number) => {
    // totalCount теперь динамический (из хука)
    const totalPages = Math.ceil(totalCount / PAGINATION_SIZE);

    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalCount]);

  // === 6. Другие Обработчики ===
  const handleSetMode = useCallback((newMode: SelectionMode) => {
    setMode(newMode);
    setCurrentPage(1); // СБРОС СТРАНИЦЫ
    if (newMode === 'manual') {
      setFilters({});
    }
  }, []);

  const handleFilterChange = useCallback((key: keyof GetPropertiesParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // СБРОС СТРАНИЦЫ
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1); // СБРОС СТРАНИЦЫ
  }, []);

  const handleToggleSelect = useCallback((id: number) => {
    setAllSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
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
    if (isDisabled) return;

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

    createMutation.mutate(payload);
  };

  // === 7. Подготовка данных для таблицы ===
  const propertiesWithSelection = useMemo(() => {
    return properties.map(prop => ({
      ...prop,
      selected: allSelectedIds.has(prop.id),
    }));
  }, [properties, allSelectedIds]);

  // === 8. Пропсы пагинации ===
  const paginationProps = {
    totalCount,
    pageSize: PAGINATION_SIZE,
    currentPage: currentPage,
    onPageChange: handlePageChange,
    isLoading,
  };

  // === Опции для FilterContent ===
  const filterOptions = {
    cities,
    districts,
    // Эти значения, вероятно, должны быть динамическими, но оставлены как в исходном коде
    minPrice: 0,
    maxPrice: 200_000_000,
    rooms: [1, 2, 3, 4, 5],
    minFloor: 1,
    maxFloor: 30,
  };

  return (
    <div className="min-h-screen w-full mx-auto">
      {/* 1. Заголовок */}
      <HeaderSection
        onSave={handleSave}
        isSaving={isSaving}
        isDisabled={isDisabled}
        title="Создать подборку"
      />

      <div className="space-y-6 md:space-y-8 mt-6">
        {/* 2. Форма редактирования */}
        <EditDetailsForm
          data={selectionDetails}
          handleChange={handleDetailsChange}
        />

        {/* 3. Основное содержимое */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 mt-6 md:mt-8">
          {/* Таблица (правая колонка) */}
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
              isLoading={isLoading}
              totalSelectedCount={totalSelectedCount}
            />
          </div>

          {/* Фильтры (левая колонка) */}
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

      {/* 4. Фиксированная кнопка сохранения */}
      <SaveButtonStickyFooter
        onSave={handleSave}
        isDisabled={isDisabled}
        isSaving={isSaving}
      />
    </div>
  );
};

export default CreateSelectionPage;