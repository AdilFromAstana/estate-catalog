import { useState, useCallback, useMemo } from 'react';
// Импортируем иконки из Lucide React
import { DollarSign, MapPin, Ruler, Building, Bed, XCircle, ChevronDown, Check, Zap, Home, Shield, Maximize2, GitBranch, Tv, Phone, Sun, Wrench, Package, Car, Wifi, Monitor, Tablet, Monitor as DesktopIcon } from 'lucide-react';

// --- ТИПЫ И ИНТЕРФЕЙСЫ (Моки) ---

/**
 * Тип для элемента характеристики (приходит с бэкенда)
 * В реальном приложении это будет в отдельном файле
 */
/** @typedef {typeof featureItemSchema} FeatureItem */

/**
 * Тип для структуры данных всех характеристик
 * @typedef {Object.<string, FeatureItem[]>} AllFeaturesData
 */

/**
 * Тип для параметров фильтрации
 * @typedef {Object} GetPropertiesParams
 * @property {number | null} cityId
 * @property {number | null} districtId
 * @property {number | null} minPrice
 * @property {number | null} maxPrice
 * @property {number | null} minArea
 * @property {number | null} maxArea
 * @property {number | null} minFloor
 * @property {number | null} maxFloor
 * @property {number | null} rooms
 * @property {number[] | null} FlatSecurity
 * @property {number[] | null} FlatBalcony
 * @property {number[] | null} FlatDoor
 * @property {number[] | null} FlatFlooring
 * @property {number[] | null} FlatOptions
 * @property {number[] | null} FlatParking
 * @property {number[] | null} FlatPhone
 * @property {number[] | null} FlatRenovation
 * @property {number[] | null} FlatToilet
 * @property {number[] | null} InetType
 * @property {number[] | null} LiveFurniture
 * @property {number[] | null} FlatBuilding
 * @property {string | null} propertyType
 * @property {boolean} isNewBuilding
 * @property {boolean} isFromOwner
 * @property {number | null} minYearBuilt
 * @property {number | null} maxYearBuilt
 * @property {number | null} minTotalFloors
 * @property {number | null} maxTotalFloors
 * @property {boolean} isNotLastFloor
 * @property {boolean} isNotFirstFloor
 * @property {number | null} residentialComplexId
 * @property {number | null} minKitchenArea
 * @property {number | null} maxKitchenArea
 */

/** @typedef {'mobile' | 'desktop'} FilterDisplayMode */


// --- МОКОВЫЕ ДАННЫЕ ---

const MOCK_CITIES = [{ id: 1, name: "Алматы" }, { id: 2, name: "Астана" }, { id: 3, name: "Шымкент" }];
const MOCK_DISTRICTS = [
    { id: 101, name: "Алмалинский р-н" },
    { id: 102, name: "Бостандыкский р-н" },
    { id: 201, name: "Есильский р-н" },
];

const MOCK_ROOMS = [1, 2, 3, 4, 5];

const generateFeatures = (key, count) => Array.from({ length: count }, (_, i) => ({
    id: i + 1, // Используем просто числа для ID
    code: `${key.substring(0, 3).toLowerCase()}_${i + 1}`,
    name: `${key} Опция ${i + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}));

/** @type {AllFeaturesData} */
const MOCK_ALL_FEATURES_DATA = {
    FlatSecurity: generateFeatures('Безопасность', 3), // Охранная сигнализация, Домофон, Консьерж
    FlatBalcony: generateFeatures('Балкон', 2), // Балкон, Лоджия
    FlatDoor: generateFeatures('Дверь', 3), // Металлическая, Деревянная, Бронированная
    FlatFlooring: generateFeatures('Пол', 4), // Ламинат, Паркет, Ковролин, Линолеум
    FlatOptions: generateFeatures('Опции', 5), // Кладовка, Гардеробная, Теплый пол, Видеонаблюдение
    FlatParking: generateFeatures('Парковка', 2), // Паркинг, Наземный
    FlatPhone: generateFeatures('Телефон', 1), // Отдельная линия
    FlatRenovation: generateFeatures('Ремонт', 4), // Евроремонт, Средний, Требует ремонта
    FlatToilet: generateFeatures('Санузел', 3), // Совмещенный, Раздельный, 2 и более
    InetType: generateFeatures('Интернет', 2), // Оптика, ADSL
    LiveFurniture: generateFeatures('Мебель', 2), // Полностью, Частично
    FlatBuilding: generateFeatures('Здание', 4), // Кирпичный, Панельный, Монолитный
};


// --- КОМПОНЕНТ УНИФИЦИРОВАННОГО ФИЛЬТРА (ОДИНАРНЫЙ И МНОЖЕСТВЕННЫЙ ВЫБОР) ---

/**
 * @param {Object} props
 * @param {keyof GetPropertiesParams} props.featureKey - Ключ фильтра в объекте filters
 * @param {string} props.title - Заголовок фильтра
 * @param {FeatureItem[]} props.options - Опции для выбора
 * @param {GetPropertiesParams} props.filters - Объект всех фильтров
 * @param {(key: keyof GetPropertiesParams, value: any) => void} props.onFilterChange - Обработчик изменения
 * @param {React.ElementType} props.Icon - Иконка
 * @param {boolean} [props.showTitle=true] - Отображать ли заголовок
 * @param {'single' | 'multiple'} [props.selectionType='multiple'] - Тип выбора
 * @param {string} [props.nullOptionText='Все'] - Текст для опции сброса (только для single)
 * @returns {JSX.Element}
 */
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
                                ? currentSelections.includes(id)
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


// --- ГЛАВНЫЙ КОМПОНЕНТ ФИЛЬТРОВ ---

const featureMap = [
    { key: "FlatSecurity", title: "Безопасность", Icon: Shield, dataKey: 'FlatSecurity' },
    { key: "FlatBalcony", title: "Балкон / Лоджия", Icon: Maximize2, dataKey: 'FlatBalcony' },
    { key: "FlatDoor", title: "Входная дверь", Icon: Home, dataKey: 'FlatDoor' },
    { key: "FlatFlooring", title: "Покрытие пола", Icon: GitBranch, dataKey: 'FlatFlooring' },
    { key: "FlatOptions", title: "Доп. опции", Icon: Package, dataKey: 'FlatOptions' },
    { key: "FlatParking", title: "Парковка", Icon: Car, dataKey: 'FlatParking' },
    { key: "FlatPhone", title: "Телефон", Icon: Phone, dataKey: 'FlatPhone' },
    { key: "FlatRenovation", title: "Ремонт", Icon: Wrench, dataKey: 'FlatRenovation' },
    { key: "FlatToilet", title: "Санузел", Icon: Monitor, dataKey: 'FlatToilet' },
    { key: "InetType", title: "Интернет", Icon: Wifi, dataKey: 'InetType' },
    { key: "LiveFurniture", title: "Мебель", Icon: Bed, dataKey: 'LiveFurniture' },
    { key: "FlatBuilding", title: "Тип здания", Icon: Building, dataKey: 'FlatBuilding' },
];

/**
 * @param {Object} props
 * @param {GetPropertiesParams} props.filters
 * @param {(key: keyof GetPropertiesParams, value: any) => void} props.onFilterChange
 * @param {() => void} props.onResetFilters
 * @param {Object} props.filterOptions
 * @param {FeatureItem[]} props.filterOptions.cities
 * @param {FeatureItem[]} props.filterOptions.districts
 * @param {number[]} props.filterOptions.rooms
 * @param {FilterDisplayMode} props.displayMode
 * @param {AllFeaturesData} props.allFeaturesData
 * @returns {JSX.Element}
 */
const FilterContent = ({ filterOptions, onFilterChange, onResetFilters, filters, displayMode, allFeaturesData }) => {

    /**
     * Рендерит основные фильтры (Район, Площадь, Этаж)
     * @param {boolean} isMobile - Флаг для мобильного режима
     */
    const renderMainFilters = (isMobile) => (
        <div className={isMobile ? "space-y-6" : "contents"}>
            {/* Города (только для мобильного/бокового фильтра) */}
            {isMobile && (
                <div className="col-span-full">
                    <FeatureFilterItem
                        featureKey="cityId"
                        title="Город"
                        Icon={MapPin}
                        options={filterOptions.cities}
                        filters={filters}
                        onFilterChange={onFilterChange}
                        selectionType="single"
                        nullOptionText="Все города"
                    />
                </div>
            )}

            {/* Район */}
            <div>
                <FeatureFilterItem
                    featureKey="districtId"
                    title="Район"
                    Icon={MapPin}
                    options={filterOptions.districts}
                    filters={filters}
                    onFilterChange={onFilterChange}
                    selectionType="single"
                    nullOptionText="Все районы"
                />
            </div>

            {/* Площадь */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Ruler className="w-4 h-4 mr-2 text-indigo-500" />
                    Площадь, м²
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="От" value={filters.minArea || ""} onChange={(e) => onFilterChange("minArea", e.target.value ? Number(e.target.value) : null)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="number" placeholder="До" value={filters.maxArea || ""} onChange={(e) => onFilterChange("maxArea", e.target.value ? Number(e.target.value) : null)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>

            {/* Этаж */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-indigo-500" />
                    Этаж
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="От" min="1" value={filters.minFloor || ""} onChange={(e) => onFilterChange("minFloor", e.target.value ? Number(e.target.value) : null)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="number" placeholder="До" min="1" value={filters.maxFloor || ""} onChange={(e) => onFilterChange("maxFloor", e.target.value ? Number(e.target.value) : null)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>

            {/* Цена (только для мобильного) */}
            {isMobile && (
                <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-indigo-500" />
                        Цена (₸)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder="От" value={filters.minPrice || ""} onChange={(e) => onFilterChange("minPrice", e.target.value ? Number(e.target.value) : null)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        <input type="number" placeholder="До" value={filters.maxPrice || ""} onChange={(e) => onFilterChange("maxPrice", e.target.value ? Number(e.target.value) : null)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>
            )}
        </div>
    );

    const renderRoomsFilter = () => (
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
                        onClick={() => filters.rooms === room ? onFilterChange("rooms", null) : onFilterChange("rooms", room)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filters.rooms === room
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-400/40"
                            : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                            }`}
                    >
                        {room} {room === 5 && '+'}
                    </button>
                ))}
            </div>
        </div>
    );

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

    // --- ОСНОВНАЯ ЛОГИКА РЕНДЕРИНГА (MOBILE MODE) ---

    if (displayMode === 'mobile') {
        return (
            <div className="space-y-6 flex-1 overflow-y-auto hide-scrollbar p-4 bg-white rounded-lg shadow-inner">
                {/* Заголовок с кнопкой сброса */}
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

                {renderRoomsFilter()}
                {renderMainFilters(true)}
                {renderAdditionalFilters()}
            </div>
        );
    }

    // --- ОСНОВНАЯ ЛОГИКА РЕНДЕРИНГА (DESKTOP MODE) ---

    if (displayMode === 'desktop') {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-xl space-y-6 border border-indigo-100 transition-all duration-300">

                {/* 1. ВЕРХНИЙ РЯД: Комнаты, Цена, Город и Быстрые переключатели */}
                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-indigo-100">

                    {/* Комнаты */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Комнаты:</span>
                        {filterOptions.rooms.map((room) => (
                            <button
                                key={room}
                                type="button"
                                onClick={() => filters.rooms === room ? onFilterChange("rooms", null) : onFilterChange("rooms", room)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${filters.rooms === room ? "bg-indigo-600 text-white shadow-md shadow-indigo-400/40" : "bg-gray-100 text-gray-700 hover:bg-indigo-100"}`}
                            >
                                {room} {room === 5 && '+'}
                            </button>
                        ))}
                    </div>

                    {/* Цена */}
                    <div className='flex items-center space-x-2 border border-gray-300 rounded-xl px-3 py-2 bg-white flex-1 min-w-[220px] max-w-xs shadow-sm'>
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <input type="number" placeholder="От (₸)" value={filters.minPrice || ""} onChange={(e) => onFilterChange("minPrice", e.target.value ? Number(e.target.value) : null)} className="text-sm w-full focus:outline-none" />
                        <span className="text-gray-400">/</span>
                        <input type="number" placeholder="До (₸)" value={filters.maxPrice || ""} onChange={(e) => onFilterChange("maxPrice", e.target.value ? Number(e.target.value) : null)} className="text-sm w-full focus:outline-none" />
                    </div>

                    {/* Город (Скрываем заголовок, так как это inline-элемент) */}
                    <div className='min-w-[150px]'>
                        <FeatureFilterItem
                            featureKey="cityId"
                            title="Город"
                            Icon={MapPin}
                            options={filterOptions.cities}
                            filters={filters}
                            onFilterChange={onFilterChange}
                            selectionType="single"
                            nullOptionText="Весь Казахстан"
                            showTitle={false}
                        />
                    </div>

                    {/* Быстрые переключатели */}
                    <label className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-xl hover:bg-indigo-50 transition cursor-pointer">
                        <input type="checkbox" checked={filters.isNewBuilding} onChange={(e) => onFilterChange("isNewBuilding", e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        Новостройки
                    </label>
                    <label className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-xl hover:bg-indigo-50 transition cursor-pointer">
                        <input type="checkbox" checked={filters.isFromOwner} onChange={(e) => onFilterChange("isFromOwner", e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        От хозяев
                    </label>
                </div>

                {/* 2. ОСНОВНАЯ СЕТКА: Район, Площадь, Этаж */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 border-b border-indigo-100">
                    {/* Используем renderMainFilters(false), который теперь адаптирован */}
                    {renderMainFilters(false)}
                </div>

                {/* 3. ДОПОЛНИТЕЛЬНЫЕ ФИЛЬТРЫ (Сворачиваемый блок) */}
                <div className="pt-2">
                    <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">
                            <span className="flex items-center">
                                <ChevronDown className="w-5 h-5 mr-1 transition-transform group-open:rotate-180 text-indigo-500" />
                                Еще настройки и характеристики
                            </span>
                            <span className="text-gray-500 text-xs font-normal">({featureMap.length} категорий)</span>
                        </summary>

                        <div className="mt-4 pb-4">
                            {renderAdditionalFilters()}
                        </div>
                    </details>
                </div>

                {/* ФИНАЛЬНЫЙ РЯД с кнопками действий */}
                <div className="flex justify-between items-center pt-4 border-t border-indigo-100">
                    <button onClick={onResetFilters} className="text-sm flex items-center text-gray-500 hover:text-red-600 transition font-medium">
                        <XCircle className="w-4 h-4 mr-1" />
                        Очистить всё
                    </button>

                    <button className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition transform hover:scale-[1.01] duration-200">
                        Показать результаты (229 776)
                    </button>
                </div>

            </div>
        );
    }

    return null;
};

// --- ГЛАВНЫЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ ---

const INITIAL_FILTERS = {
    cityId: null, districtId: null, minPrice: null, maxPrice: null,
    minArea: null, maxArea: null, minFloor: null, maxFloor: null, rooms: null,
    FlatSecurity: null, FlatBalcony: null, FlatDoor: null, FlatFlooring: null,
    FlatOptions: null, FlatParking: null, FlatPhone: null, FlatRenovation: null,
    FlatToilet: null, InetType: null, LiveFurniture: null, FlatBuilding: null,
    propertyType: 'flat', isNewBuilding: false, isFromOwner: false,
    minYearBuilt: null, maxYearBuilt: null, minTotalFloors: null, maxTotalFloors: null,
    isNotLastFloor: false, isNotFirstFloor: false, residentialComplexId: null,
    minKitchenArea: null, maxKitchenArea: null,
};


const App = () => {
    /** @type {[GetPropertiesParams, React.Dispatch<React.SetStateAction<GetPropertiesParams>>]} */
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    /** @type {[FilterDisplayMode, React.Dispatch<React.SetStateAction<FilterDisplayMode>>]} */
    const [displayMode, setDisplayMode] = useState('desktop');

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
    }, []);

    const filterOptions = {
        cities: MOCK_CITIES,
        districts: MOCK_DISTRICTS,
        minPrice: 1000000,
        maxPrice: 100000000,
        rooms: MOCK_ROOMS,
        minFloor: 1,
        maxFloor: 20,
    };

    // Определяем основной класс контейнера для режима отображения
    const containerClass = displayMode === 'mobile'
        ? "relative p-4 min-h-screen max-w-sm mx-auto bg-gray-50"
        : "relative p-8 min-h-screen bg-gray-100 flex justify-center items-start";

    const ModeIcon = displayMode === 'desktop' ? DesktopIcon : Tablet;

    return (
        <div className={containerClass}>
            {/* Панель управления режимом: теперь абсолютное позиционирование, чтобы не влиять на макет */}
            <div className="absolute top-4 left-4 z-10 md:top-8 md:left-8">
                <button
                    onClick={() => setDisplayMode(prev => prev === 'desktop' ? 'mobile' : 'desktop')}
                    className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-full text-sm font-semibold shadow-md hover:bg-indigo-600 transition"
                >
                    <ModeIcon className="w-4 h-4 mr-2" />
                    Переключить на {displayMode === 'desktop' ? 'Мобильный' : 'Десктоп'}
                </button>
            </div>

            <div className={`w-full ${displayMode === 'desktop' ? 'max-w-6xl' : ''}`}>
                <FilterContent
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                    filterOptions={filterOptions}
                    displayMode={displayMode}
                    allFeaturesData={MOCK_ALL_FEATURES_DATA}
                />
            </div>
        </div>
    );
};

export default App;
