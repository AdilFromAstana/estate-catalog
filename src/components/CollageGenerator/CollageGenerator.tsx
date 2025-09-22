import React, { useState, useRef } from 'react';
import { type UploadedImage } from '../../types/index';
import html2canvas from 'html2canvas';

// Моковые данные
const mockData = {
    price: '25 300 000 ₸',
    area: '46 м²',
    floor: '17 из 23',
    features: [
        'Евро-двушка',
        'Закрытый двор',
        '2 госсадика, школа лицея НурОрда'
    ],
    title: 'Сенатор park',
    orientation: 'Хазрет Султан',
    logo: 'ПАНОРАМА Group',
    agent: 'Асель РГ Шолпан',
    address: 'пр-кт Тлендиева 15/3',
    buildingType: 'Монолит/газоблок',
    year: '2010',
    ceilingHeight: '2.7 м',
    hasParking: true,
    hasFurniture: true,
    class: 'Стандарт класс'
};

const templates = [
    {
        id: 'senator-park',
        name: 'Сенатор Park',
        colors: {
            primary: '#e86a00',
            secondary: '#4a6c3d',
            text: '#ffffff'
        },
        layout: {
            mainImage: { width: '100%', height: '400px' },
            logo: { top: '40px', left: '20px', width: '120px', height: '40px' },
            orientation: { top: '40px', right: '20px', width: '200px', height: '40px' },
            title: { top: '200px', left: '20px', width: '200px', height: '80px' },
            price: { top: '300px', left: '20px', width: '200px', height: '60px' },
            features: { top: '300px', left: '240px', width: '540px', height: '100px' },
            interior1: { top: '400px', left: '0px', width: '266px', height: '200px' },
            interior2: { top: '400px', left: '266px', width: '266px', height: '200px' },
            interior3: { top: '400px', left: '532px', width: '266px', height: '200px' },
            agent: { top: '600px', left: '0px', width: '800px', height: '40px' }
        }
    },
    {
        id: 'tamyz',
        name: 'ЖК Тамыз',
        colors: {
            primary: '#00bfff',
            secondary: '#ffffff',
            text: '#000000'
        },
        layout: {
            mainImage: { width: '100%', height: '300px' },
            rooms: { top: '100px', left: '20px', width: '150px', height: '60px' },
            price: { top: '100px', right: '20px', width: '180px', height: '60px' },
            title: { top: '300px', left: '20px', width: '300px', height: '80px' },
            address: { top: '390px', left: '20px', width: '300px', height: '20px' },
            area: { top: '300px', right: '250px', width: '150px', height: '60px' },
            floor: { top: '370px', right: '250px', width: '150px', height: '60px' },
            class: { top: '440px', right: '250px', width: '150px', height: '60px' },
            features: { top: '400px', left: '20px', width: '300px', height: '100px' },
            interior1: { top: '500px', left: '0px', width: '266px', height: '200px' },
            interior2: { top: '500px', left: '266px', width: '266px', height: '200px' },
            interior3: { top: '500px', left: '532px', width: '266px', height: '200px' }
        }
    }
];

const RealEstateCollageGenerator: React.FC = () => {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const collageRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: UploadedImage[] = Array.from(files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            url: URL.createObjectURL(file)
        }));

        setImages(newImages);
    };

    const generateCollage = async () => {
        if (!collageRef.current || images.length < 1) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(collageRef.current, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            const link = document.createElement('a');
            link.download = 'real-estate-collage.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Ошибка при генерации коллажа:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const renderTemplate = () => {
        const template = selectedTemplate;
        const mainImage = images[0];
        const interior1 = images[1] || null;
        const interior2 = images[2] || null;
        const interior3 = images[3] || null;

        return (
            <div
                ref={collageRef}
                className="w-full relative"
                style={{
                    backgroundColor: template.colors.primary,
                    fontFamily: 'Arial, sans-serif',
                    position: 'relative',
                    width: '800px',
                    minHeight: '640px'
                }}
            >
                {/* Главное фото */}
                {mainImage && (
                    <img
                        src={mainImage.url}
                        alt="Main"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: template.layout.mainImage.width,
                            height: template.layout.mainImage.height,
                            objectFit: 'cover'
                        }}
                    />
                )}

                {/* Логотип */}
                <div
                    style={{
                        position: 'absolute',
                        top: template.layout.logo?.top || '40px',
                        left: template.layout.logo?.left || '20px',
                        width: template.layout.logo?.width || '120px',
                        height: template.layout.logo?.height || '40px',
                        backgroundColor: template.colors.secondary,
                        color: template.colors.text,
                        padding: '5px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                >
                    {template.id === 'senator-park' ? 'ПАНОРАМА Group' : 'Витрина'}
                </div>

                {/* Ориентир */}
                <div
                    style={{
                        position: 'absolute',
                        top: template.layout.orientation?.top || '40px',
                        right: template.layout.orientation?.right || '20px',
                        width: template.layout.orientation?.width || '200px',
                        height: template.layout.orientation?.height || '40px',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '5px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        border: '1px solid #ddd'
                    }}
                >
                    {template.id === 'senator-park' ? (
                        <>
                            <span>ОРИЕНТИР:</span>
                            <span style={{ marginLeft: '5px' }}>{mockData.orientation}</span>
                        </>
                    ) : (
                        mockData.orientation
                    )}
                </div>

                {/* Заголовок */}
                <div
                    style={{
                        position: 'absolute',
                        top: template.layout.title?.top || '200px',
                        left: template.layout.title?.left || '20px',
                        width: template.layout.title?.width || '200px',
                        height: template.layout.title?.height || '80px',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        padding: '10px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        zIndex: 10
                    }}
                >
                    {mockData.title}
                </div>

                {/* Цена */}
                <div
                    style={{
                        position: 'absolute',
                        top: template.layout.price?.top || '300px',
                        left: template.layout.price?.left || '20px',
                        width: template.layout.price?.width || '200px',
                        height: template.layout.price?.height || '60px',
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {mockData.price}
                </div>

                {/* Характеристики */}
                <div
                    style={{
                        position: 'absolute',
                        top: template.layout.features?.top || '300px',
                        left: template.layout.features?.left || '240px',
                        width: template.layout.features?.width || '540px',
                        height: template.layout.features?.height || '100px',
                        color: 'white',
                        fontSize: '14px',
                        zIndex: 10,
                        padding: '10px'
                    }}
                >
                    {mockData.features.map((feature, idx) => (
                        <div key={idx} style={{ marginBottom: '5px' }}>
                            ✓ {feature}
                        </div>
                    ))}
                </div>

                {/* Интерьеры */}
                {interior1 && (
                    <img
                        src={interior1.url}
                        alt="Interior 1"
                        style={{
                            position: 'absolute',
                            top: template.layout.interior1?.top || '400px',
                            left: template.layout.interior1?.left || '0px',
                            width: template.layout.interior1?.width || '266px',
                            height: template.layout.interior1?.height || '200px',
                            objectFit: 'cover',
                            zIndex: 5
                        }}
                    />
                )}
                {interior2 && (
                    <img
                        src={interior2.url}
                        alt="Interior 2"
                        style={{
                            position: 'absolute',
                            top: template.layout.interior2?.top || '400px',
                            left: template.layout.interior2?.left || '266px',
                            width: template.layout.interior2?.width || '266px',
                            height: template.layout.interior2?.height || '200px',
                            objectFit: 'cover',
                            zIndex: 5
                        }}
                    />
                )}
                {interior3 && (
                    <img
                        src={interior3.url}
                        alt="Interior 3"
                        style={{
                            position: 'absolute',
                            top: template.layout.interior3?.top || '400px',
                            left: template.layout.interior3?.left || '532px',
                            width: template.layout.interior3?.width || '266px',
                            height: template.layout.interior3?.height || '200px',
                            objectFit: 'cover',
                            zIndex: 5
                        }}
                    />
                )}

                {/* Агент */}
                <div
                    style={{
                        position: 'absolute',
                        top: template.layout.agent?.top || '600px',
                        left: template.layout.agent?.left || '0px',
                        width: template.layout.agent?.width || '800px',
                        height: template.layout.agent?.height || '40px',
                        backgroundColor: 'orange',
                        color: 'white',
                        padding: '10px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {mockData.agent}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Генератор объявлений о недвижимости</h1>

            {/* Загрузка изображений */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Загрузите изображения</h2>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                />
                <p className="text-sm text-gray-500 mt-2">
                    Загрузите главное фото (фасад) и 3 фото интерьеров
                </p>
            </div>

            {/* Выбор шаблона */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Выберите шаблон</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template)}
                            className={`p-4 border rounded-lg transition-all text-left ${selectedTemplate.id === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-medium text-sm text-gray-900">{template.name}</div>
                            <div className="text-xs text-gray-500 mt-1">ID: {template.id}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Предпросмотр */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Предпросмотр</h2>
                <div className="border rounded-lg overflow-hidden bg-gray-100 flex justify-center p-4">
                    <div className="relative">
                        {images.length > 0 ? (
                            renderTemplate()
                        ) : (
                            <div className="w-full h-96 flex items-center justify-center text-gray-500">
                                Загрузите изображения для предпросмотра
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Скачать */}
            <div className="flex justify-center">
                <button
                    onClick={generateCollage}
                    disabled={images.length < 1 || isGenerating}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Генерация...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Скачать изображение
                        </>
                    )}
                </button>
            </div>

            {/* Информация о загруженных изображениях */}
            {images.length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow p-4">
                    <h3 className="font-medium mb-2">Загруженные изображения ({images.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {images.map((image, index) => (
                            <div key={image.id} className="relative">
                                <img
                                    src={image.url}
                                    alt={`Uploaded ${index + 1}`}
                                    className="w-full h-20 object-cover rounded border"
                                />
                                <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                    {index === 0 ? 'Фасад' : `Интерьер ${index}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealEstateCollageGenerator;