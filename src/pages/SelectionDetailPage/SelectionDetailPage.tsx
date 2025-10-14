// src/pages/SelectionDetailPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelectionWithInfiniteScroll } from '../../hooks/useSelection';
import SelectionViewToggle from './components/SelectionViewToggle';
import SelectionInfoCard from './components/SelectionInfoCard';
import PropertyCard from './components/PropertyCard';
import PropertyListItem from './components/PropertyListItem';

export const SelectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const selectionId = Number(id);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useSelectionWithInfiniteScroll(selectionId);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const observerTarget = useRef<HTMLDivElement>(null);

  // Бесконечный скролл
  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  // Собираем все объекты со всех страниц
  const allProperties = data?.pages.flatMap(page => page.properties.data) || [];
  const total = data?.pages[0]?.properties.total || 0;
  const selection = data?.pages[0]?.selection;
  const createdBy = data?.pages[0]?.createdBy;

  if (isLoading)
    return <div className="flex items-center justify-center h-[70vh]">Загрузка...</div>;

  if (isError)
    return <div className="text-center py-16 text-red-500">Ошибка загрузки</div>;

  if (!selection || allProperties.length === 0 && total === 0)
    return <div className="text-center py-16">Объекты не найдены</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <SelectionInfoCard selection={selection} total={total} createdBy={createdBy!} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Объекты ({total})</h2>
        <SelectionViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {allProperties.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProperties.map((p) => (
                <PropertyCard key={p.id} p={p} selectionId={selectionId} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {allProperties.map((p) => (
                <PropertyListItem key={p.id} p={p} selectionId={selectionId} />
              ))}
            </div>
          )}

          {(hasNextPage || isFetchingNextPage) && (
            <div ref={observerTarget} className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">Нет объектов</div>
      )}
    </div>
  );
};

export default SelectionDetailPage;