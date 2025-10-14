// src/pages/PropertyDetailPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    MapPin,
    User,
    Phone,
    MessageSquare,
    Loader2,
    Bed,
    LayoutGrid,
    Home,
    Search,
} from 'lucide-react';
import { formatPrice } from '../../api/propertyApi';
import { useSelectionWithInfiniteScroll } from '../../hooks/useSelection';
import type { PropertyResponse } from '../../types';
import EstateImageGallery from '../../components/EstateImageGallery';

const featureMap: Record<string, Record<string, string>> = {
    'buildingTypeCode': { 'brick': 'Кирпичный', 'monolith': 'Монолитный', 'panel': 'Панельный', '': 'Не указано' },
    'flatRenovationCode': { 'neat_renovation': 'Аккуратный ремонт', 'cosmetic': 'Косметический', 'designer': 'Дизайнерский', '': 'Не указано' },
    'flatBalconyCode': { 'balcony': 'Балкон', 'loggia': 'Лоджия', '': 'Нет' },
    'liveFurnitureCode': { 'fully': 'Полностью', '': 'Частично / Нет' },
    'flatParkingCode': { 'parking': 'Паркинг', '': 'Нет' },
    'flatToiletCode': { 'combined': 'Совмещенный', 'separate': 'Раздельный', '': 'Не указано' },
    'flatSecurityCodes': { 'intercom': 'Домофон', 'video_surveillance': 'Видеонаблюдение', 'concierge': 'Консьерж' }
};

const getFeatureValue = (codeType: keyof typeof featureMap, code: string | string[]) => {
    if (Array.isArray(code)) {
        return code.map(c => featureMap[codeType]?.[c] || c).join(', ') || 'Нет';
    }
    return featureMap[codeType]?.[code] || featureMap[codeType]?.[''] || code;
};

const generateFeatures = (property: PropertyResponse, isDetail: boolean) => {
    const securityValue = getFeatureValue('flatSecurityCodes', property.flatSecurityCodes!);
    const features = [
        { label: 'Комнат', value: property.rooms.toString(), icon: <Bed className="w-4 h-4 text-indigo-400" /> },
        { label: 'Площадь', value: `${property!.area} м²`, icon: <LayoutGrid className="w-4 h-4 text-indigo-400" /> },
        { label: 'Этаж', value: `${property.floor}/${property.totalFloors}`, icon: <Home className="w-4 h-4 text-indigo-400" /> },
        { label: 'Год', value: property.yearBuilt!.toString(), icon: <Search className="w-4 h-4 text-indigo-400" /> },
        { label: 'Тип здания', value: getFeatureValue('buildingTypeCode', property.buildingTypeCode!) },
        { label: 'Ремонт', value: getFeatureValue('flatRenovationCode', property.flatRenovationCode!) },
        { label: 'Мебель', value: getFeatureValue('liveFurnitureCode', property.liveFurnitureCode!) },
        { label: 'Балкон', value: getFeatureValue('flatBalconyCode', property.flatBalconyCode!) },
        { label: 'Парковка', value: getFeatureValue('flatParkingCode', property.flatParkingCode!) },
        { label: 'Санузел', value: getFeatureValue('flatToiletCode', property.flatToiletCode!) },
        { label: 'Потолки', value: property.ceiling && parseFloat(property.ceiling) > 0 ? `${parseFloat(property.ceiling).toFixed(1)} м` : 'Не указано' },
        { label: 'Безопасность', value: securityValue },
    ].filter(feat => isDetail || feat.icon); // Only show icons in list view for simplicity, or all features in detail

    if (!isDetail) {
        return features.slice(0, 4); // Limited set for list view card
    }
    return features;
};

const RelatedCard = ({ property, onSelect }: { property: any; onSelect: () => void }) => {
    return (
        <div
            onClick={onSelect}
            className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
        >
            <img
                src={property.photos[0] || 'https://placehold.co/300x200'}
                alt={property.title}
                className="w-full h-32 object-cover"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/300x200/eeeeee/333333?text=Нет')}
            />
            <div className="p-3">
                <p className="text-xs text-gray-500 truncate">{property.district}</p>
                <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{property.title}</h4>
                <p className="text-lg font-bold text-indigo-700 mt-1">{formatPrice(property.price)}</p>
            </div>
        </div>
    );
};

const RELATED_LOAD_STEP = 10;

const PropertyInSelectionPage: React.FC = () => {
    const { id, propertyId } = useParams<{ id: string; propertyId: string }>();
    const navigate = useNavigate();

    const selectionIdNum = Number(id);
    const propertyIdNum = Number(propertyId);

    const {
        data: selectionData,
        isLoading,
        isError,
    } = useSelectionWithInfiniteScroll(selectionIdNum);

    const [relatedLoadState, setRelatedLoadState] = useState({
        count: RELATED_LOAD_STEP,
        isProcessing: false,
    });

    // Собираем все объекты из всех страниц
    const allProperties = useMemo(() => {
        if (!selectionData) return [];
        return selectionData.pages.flatMap(page => page.properties.data);
    }, [selectionData]);

    // Текущий объект
    const currentProperty = useMemo(() => {
        return allProperties.find(p => p.id === propertyIdNum);
    }, [allProperties, propertyIdNum]);

    // Другие объекты (без текущего)
    const relatedProperties = useMemo(() => {
        return allProperties.filter(p => p.id !== propertyIdNum);
    }, [allProperties, propertyIdNum]);

    // Сброс состояния при смене объекта
    useEffect(() => {
        setRelatedLoadState({ count: RELATED_LOAD_STEP, isProcessing: false });
    }, [propertyIdNum]);

    const handleLoadMore = useCallback(() => {
        if (relatedLoadState.isProcessing) return;
        if (relatedLoadState.count >= relatedProperties.length) return;

        setRelatedLoadState(prev => ({ ...prev, isProcessing: true }));

        // Имитация загрузки (в реальности — не нужно, т.к. все данные уже есть)
        setTimeout(() => {
            setRelatedLoadState(prev => ({
                count: Math.min(prev.count + RELATED_LOAD_STEP, relatedProperties.length),
                isProcessing: false,
            }));
        }, 300);
    }, [relatedLoadState.isProcessing, relatedLoadState.count, relatedProperties.length]);

    console.log(handleLoadMore)

    const handleSelectProperty = (id: number) => {
        navigate(`/selections/${selectionIdNum}/property/${id}`);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [propertyIdNum]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Загрузка объекта...</div>;
    }

    if (isError || !currentProperty || !selectionData) {
        return <div className="text-center py-20 text-red-500">Объект не найден</div>;
    }

    const { createdBy } = selectionData.pages[0];
    const features = generateFeatures(currentProperty, true);

    // Отображаемые связанные объекты
    const visibleRelated = relatedProperties.slice(0, relatedLoadState.count);
    const hasMore = relatedLoadState.count < relatedProperties.length;

    return (
        <div className="w-full mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-0">
                    {currentProperty.title}
                </h1>
                <button
                    onClick={() => navigate(`/selections/${selectionIdNum}`)}
                    className="flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition duration-150 p-2 rounded-lg hover:bg-indigo-50"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Назад к подборке
                </button>
            </div>

            {/* Price & Location */}
            <div className="mb-6">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-700">
                    {formatPrice(currentProperty.price)}
                </div>
                <p className="text-gray-600 mt-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {currentProperty.district}, {currentProperty.city}
                    {currentProperty.complex && ` • ЖК "${currentProperty.complex}"`}
                </p>
            </div>

            <EstateImageGallery photos={currentProperty.photos} />

            {/* Description */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Описание</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{currentProperty.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Характеристики</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {features.map((feat, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500">{feat.label}</div>
                            <div className="font-medium text-gray-800">{feat.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-indigo-700 mb-4">Связь с агентом</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-indigo-50 p-4 rounded-xl flex items-center space-x-4 flex-grow shadow-sm">
                        <User className="w-8 h-8 text-indigo-600" />
                        <div>
                            <p className="text-sm text-gray-600">Агент</p>
                            <p className="text-lg font-bold text-indigo-800">
                                {createdBy.firstName} {createdBy.lastName}
                            </p>
                        </div>
                    </div>
                    <a
                        href={`tel:${createdBy.phone}`}
                        className="bg-green-500 text-white py-3 px-6 rounded-xl font-semibold text-center shadow-sm hover:bg-green-600 transition flex items-center justify-center gap-2"
                    >
                        <Phone className="w-5 h-5" /> Позвонить
                    </a>
                    <a
                        href={`https://wa.me/${createdBy.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold text-center shadow-sm hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                        <MessageSquare className="w-5 h-5" /> WhatsApp
                    </a>
                </div>
            </div>

            {/* Related Properties */}
            {relatedProperties.length > 0 && (
                <div className="mt-10 pt-6 border-t-2 border-indigo-100">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-4">
                        Другие объекты из подборки ({visibleRelated.length} из {relatedProperties.length})
                    </h3>
                    <div className="flex overflow-x-auto pb-4 space-x-4 hide-scrollbar">
                        {visibleRelated.map((prop) => (
                            <RelatedCard
                                key={prop.id}
                                property={prop}
                                onSelect={() => handleSelectProperty(prop.id)}
                            />
                        ))}
                        {hasMore && (
                            <div className="flex-shrink-0 w-64 bg-indigo-50 rounded-xl flex items-center justify-center">
                                {relatedLoadState.isProcessing ? (
                                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                ) : (
                                    <span className="text-indigo-600">Загрузка...</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyInSelectionPage;