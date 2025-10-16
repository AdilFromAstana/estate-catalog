import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MapPin,
  Ruler,
  Building,
  DollarSign,
  Bed,
  XCircle,
  ChevronDown,
  Check,
  Zap,
} from "lucide-react";
import type { City, District, GetPropertiesParams } from "../types";

const formatNumber = (value: string | number) => {
  if (!value) return "";
  const num = parseInt(value.toString().replace(/\D/g, ""), 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("ru-RU"); // разделяет по тысячам (1 000 000)
};

const PriceFilter = ({ filters, onFilterChange, filterOptions }: any) => {
  const [minDisplay, setMinDisplay] = useState("");
  const [maxDisplay, setMaxDisplay] = useState("");

  // 🔁 Синхронизируем внутреннее состояние с пропсами
  useEffect(() => {
    setMinDisplay(filters.minPrice ? formatNumber(filters.minPrice) : "");
  }, [filters.minPrice]);

  useEffect(() => {
    setMaxDisplay(filters.maxPrice ? formatNumber(filters.maxPrice) : "");
  }, [filters.maxPrice]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, ""); // убираем пробелы
    setMinDisplay(formatNumber(raw));
    const numeric = parseInt(raw.replace(/\D/g, ""), 10);
    onFilterChange("minPrice", isNaN(numeric) ? null : numeric);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "");
    setMaxDisplay(formatNumber(raw));
    const numeric = parseInt(raw.replace(/\D/g, ""), 10);
    onFilterChange("maxPrice", isNaN(numeric) ? null : numeric);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          inputMode="numeric"
          placeholder="От"
          value={minDisplay}
          onChange={handleMinChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="text"
          inputMode="numeric"
          placeholder="До"
          value={maxDisplay}
          onChange={handleMaxChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0 ₸</span>
        <span>{formatNumber(filterOptions.maxPrice)} ₸</span>
      </div>
    </div>
  );
};

const FeatureFilterItem = ({ featureKey, title, options, filters, onFilterChange, Icon, showTitle = true, selectionType = 'multiple', nullOptionText = 'Все' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Текущие выбранные значения. Массив для multiple, число/null для single
  const currentSelections = useMemo(() => {
    const val = filters[featureKey];
    if (selectionType === 'multiple') {
      return Array.isArray(val) ? val : [];
    }
    return typeof val === 'number' ? val : null;
  }, [filters, featureKey, selectionType]);

  // Обработка выбора опции
  const handleToggleOption = useCallback((id) => {
    let newValue;

    if (selectionType === 'multiple') {
      // МНОЖЕСТВЕННЫЙ ВЫБОР
      const idNumber = Number(id);
      const isSelected = currentSelections.includes(idNumber);
      let newSelections;

      if (isSelected) {
        newSelections = currentSelections.filter(itemId => itemId !== idNumber);
      } else {
        newSelections = [...currentSelections, idNumber];
      }
      // Если массив пуст, передаем null
      newValue = newSelections.length > 0 ? newSelections : null;

    } else {
      // ОДИНОЧНЫЙ ВЫБОР
      const idNumber = Number(id);

      // Если ID совпадает с текущим (клик по выбранному элементу или клик по опции сброса), сбрасываем
      if (idNumber === currentSelections || id === 'null') {
        newValue = null;
      } else {
        newValue = idNumber;
      }

      // Закрываем дропдаун после одиночного выбора
      setIsOpen(false);
    }

    onFilterChange(featureKey, newValue);
  }, [currentSelections, onFilterChange, featureKey, selectionType]);


  // Формирование текста для кнопки
  const buttonText = useMemo(() => {
    if (selectionType === 'multiple') {
      return currentSelections.length > 0
        ? `${title} (${currentSelections.length})`
        : title;
    }
    // ОДИНОЧНЫЙ ВЫБОР
    const selectedOption = options.find(opt => opt.id === currentSelections);
    return selectedOption ? selectedOption.name : title;
  }, [title, currentSelections, options, selectionType]);


  if (!options || options.length === 0) return null;

  return (
    <div className="relative">
      {/* Заголовок (опционально) */}
      {showTitle && (
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Icon className="w-4 h-4 mr-2 text-indigo-500" />
          {title}
        </label>
      )}

      {/* Кнопка-заголовок */}
      <button
        type="button"
        className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium border rounded-xl transition-all appearance-none bg-white ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-gray-300 hover:border-gray-400'
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center text-gray-700">
          {/* Иконка видна только если заголовок скрыт, чтобы не дублировать */}
          {!showTitle && <Icon className="w-4 h-4 mr-2 text-indigo-500" />}
          {buttonText}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {/* Выпадающий список опций */}
      {isOpen && (
        <div
          className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-fadeIn"
          style={{ animationDuration: '0.2s' }}
          onBlur={() => setIsOpen(false)} // Закрываем при уходе фокуса
          tabIndex={-1} // Делаем div фокусируемым
        >
          <div className="flex flex-col p-1">
            {/* Опция сброса (только для одиночного выбора) */}
            {selectionType === 'single' && (
              <button
                key="null-option"
                type="button"
                onClick={() => handleToggleOption('null')}
                className={`w-full flex items-center justify-between p-2 text-sm rounded-lg transition-colors text-left ${currentSelections === null
                  ? 'bg-indigo-100 text-indigo-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span className="truncate text-left flex-1">{nullOptionText}</span>
                {currentSelections === null && <Check className="w-4 h-4 ml-2" />}
              </button>
            )}

            {options.map(option => {
              const id = Number(option.id); // ID должны быть числами
              const isSelected = selectionType === 'multiple'
                ? currentSelections!.includes(id)
                : currentSelections === id;

              // Для одиночного выбора показываем полное название в списке
              const optionName = selectionType === 'single' ? option.name : option.name.replace(option.name.split(' ')[0], '').trim();

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleToggleOption(id)}
                  className={`w-full flex items-center justify-between p-2 text-sm rounded-lg transition-colors text-left ${isSelected
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span className="truncate text-left flex-1">
                    {optionName}
                  </span>
                  {isSelected && <Check className="w-4 h-4 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterContent: React.FC<{
  filters: GetPropertiesParams;
  onFilterChange: (key: keyof GetPropertiesParams, value: any) => void;
  onResetFilters: () => void;
  filterOptions: {
    cities: City[];
    districts: District[];
    minPrice: number;
    maxPrice: number;
    rooms: number[];
    minFloor: number | null;
    maxFloor: number | null;
  };
}> = ({ filterOptions, onFilterChange, onResetFilters, filters }) => {
  const renderAdditionalFilters = () => (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <h4 className="text-md font-semibold text-gray-800 flex items-center mb-4">
        <Zap className="w-4 h-4 mr-2 text-indigo-600" /> Дополнительные характеристики
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {featureMap.map(({ key, title, Icon, dataKey }) => {
          // @ts-ignore
          const options = allFeaturesData[dataKey];
          // @ts-ignore
          return (
            <FeatureFilterItem
              key={key}
              featureKey={key}
              title={title}
              options={options}
              filters={filters}
              onFilterChange={onFilterChange}
              Icon={Icon}
              showTitle={true}
              selectionType="multiple" // Эти фильтры остаются множественными
            />
          );
        })}
      </div>
    </div>
  );
  return (
    <div className="space-y-6 flex-1 overflow-y-auto hide-scrollbar">
      {/* Заголовок */}
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
          Фильтры поиска
        </h3>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-sm flex items-center text-gray-500 hover:text-red-600 transition"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Сбросить
        </button>
      </div>

      {/* Города */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
          Город
        </label>
        <select
          value={filters.cityId || ""}
          onChange={(e) =>
            onFilterChange(
              "cityId",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Все города</option>
          {filterOptions.cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Район */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
          Район
        </label>
        <select
          value={filters.districtId || ""}
          onChange={(e) =>
            onFilterChange(
              "districtId",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Все районы</option>
          {filterOptions.districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Цена */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-indigo-500" />
          Цена (₸)
        </label>
        <PriceFilter
          filters={filters}
          onFilterChange={onFilterChange}
          filterOptions={filterOptions}
        />
      </div>

      {/* Площадь */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Ruler className="w-4 h-4 mr-2 text-indigo-500" />
          Площадь, м²
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="От"
            value={filters.minArea || ""}
            onChange={(e) =>
              onFilterChange(
                "minArea",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="До"
            value={filters.maxArea || ""}
            onChange={(e) =>
              onFilterChange(
                "maxArea",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Этаж */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Building className="w-4 h-4 mr-2 text-indigo-500" />
          Этаж
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="От"
            min="1"
            value={filters.minFloor || ""}
            onChange={(e) =>
              onFilterChange(
                "minFloor",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="До"
            min="1"
            value={filters.maxFloor || ""}
            onChange={(e) =>
              onFilterChange(
                "maxFloor",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Комнаты */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Bed className="w-4 h-4 mr-2 text-indigo-500" />
          Количество комнат
        </label>
        <div className="flex flex-wrap gap-2">
          {filterOptions.rooms.map((room) => (
            <button
              key={room}
              type="button"
              onClick={() =>
                filters.rooms === room
                  ? onFilterChange("rooms", null)
                  : onFilterChange("rooms", room)
              }
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filters.rooms === room
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-400/40"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                }`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      {renderAdditionalFilters()}
    </div>
  );
};
export default FilterContent