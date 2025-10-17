import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
    MessageCircle,
    Eye,
    HelpCircle,
    Clock,
    UserCheck,
    Link,
    Globe,
    MapPin,
    Filter,
    Calculator,
    BarChart3,
    Palette,
    Smartphone,
    CheckCircle,
} from 'lucide-react';

// Define types
interface FeatureItem {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
}

interface StepItem {
    icon: React.ComponentType<{ className?: string }>;
    step: string;
    title: string;
    desc: string;
}

interface Plan {
    name: string;
    price: string;
    features: string[];
    cta: string;
    popular: boolean;
}

const App: React.FC = () => {
    // В начале компонента App добавьте:
    const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    // Data arrays
    const problemItems: FeatureItem[] = [
        { icon: MessageCircle, title: "Пишут в 23:00", desc: "«Сколько стоит?» — и пропадают" },
        { icon: Eye, title: "Листают 50 объектов", desc: "но не звонят" },
        { icon: HelpCircle, title: "Спрашивают про ипотеку", desc: "но не хотят оформлять" },
        { icon: Clock, title: "Тратите часы", desc: "на тех, кто никогда не купит" }
    ];

    const steps: StepItem[] = [
        { icon: UserCheck, step: "1", title: "Зарегистрируйтесь по SMS", desc: "1 минута" },
        { icon: Link, step: "2", title: "Вставьте ссылки с Kolesa/Krisha", desc: "Объекты импортируются автоматически" },
        { icon: Globe, step: "3", title: "Опубликуйте каталог", desc: "Получите ссылку и начните получать заявки" }
    ];

    const features: FeatureItem[] = [
        { icon: MapPin, title: "Карта объектов", desc: "Клиент видит, где именно находится квартира" },
        { icon: Filter, title: "Фильтры", desc: "Сам отбирает подходящие — не грузит вас вопросами" },
        { icon: Calculator, title: "Кредитный калькулятор", desc: "Видит ежемесячный платёж — не спрашивает \"а сколько с ипотекой?\"" },
        { icon: BarChart3, title: "Статистика просмотров", desc: "Знаете, какие объекты интересны" },
        { icon: Palette, title: "Свой логотип и цвета", desc: "Выглядит как ваш бренд" },
        { icon: Smartphone, title: "Мобильная версия", desc: "Клиенты смотрят даже ночью" }
    ];

    const testimonials = [
        {
            name: "Айдар",
            city: "Алматы",
            role: "Риэлтор",
            photo: "https://placehold.co/80x80/6366f1/white?text=А",
            quote: "Раньше тратил 3 часа в день на «просто посмотреть». Теперь получаю 2–3 заявки в день — и все реально хотят купить.",
            stats: "17 заявок за 2 недели · 3 сделки · Средний чек: 25 млн тг"
        },
        {
            name: "Жанар",
            city: "Астана",
            role: "Агентство «Дом+»",
            photo: "https://placehold.co/80x80/10b981/white?text=Ж",
            quote: "С JUZ мы перестали отвечать на «а сколько с ипотекой?». Клиент сам всё посчитал — и пришёл готовым к сделке.",
            stats: "12 заявок за 10 дней · 2 сделки"
        }
    ];

    const clientExperienceItems = [
        { title: "Клиент выбирает объекты", img: "https://placehold.co/400x250/e2e8f0/64748b?text=Фильтры" },
        { title: "Смотрит видео и карту", img: "https://placehold.co/400x250/e2e8f0/64748b?text=Видео+Карта" },
        { title: "Считает ипотеку", img: "https://placehold.co/400x250/e2e8f0/64748b?text=Калькулятор" },
        { title: "Оставляет заявку", img: "https://placehold.co/400x250/e2e8f0/64748b?text=Заявка" }
    ];

    const plans: Plan[] = [
        {
            name: "Бесплатный",
            price: "0 тг/мес",
            features: ["До 10 объектов", "5 дней пробный период", "Импорт с Kolesa/Krisha", "Кредитный калькулятор"],
            cta: "Начать бесплатно",
            popular: false
        },
        {
            name: "Стандарт",
            price: "9 990 тг/мес",
            features: ["До 50 объектов", "Подборки", "Статистика", "Мобильная версия", "Свой логотип"],
            cta: "Выбрать тариф",
            popular: true
        },
        {
            name: "Профессионал",
            price: "19 990 тг/мес",
            features: ["Неограниченно объектов", "CRM (в будущем)", "Приоритетная поддержка", "Все функции"],
            cta: "Выбрать тариф",
            popular: false
        }
    ];

    // Состояния для превью
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [previewData, setPreviewData] = useState<any>(null);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);

    // Функция загрузки превью
    const handlePreview = async () => {
        if (!previewUrl.trim()) return;

        setIsPreviewLoading(true);
        setPreviewError(null);
        setPreviewData(null);

        try {
            const encodedUrl = encodeURIComponent(previewUrl.trim());
            const response = await fetch(`https://juz-realestate.kz/api/properties/preview?url=${encodedUrl}`);

            if (!response.ok) {
                throw new Error('Не удалось загрузить объявление. Проверьте ссылку.');
            }

            const data = await response.json();
            setPreviewData(data);
        } catch (err) {
            setPreviewError(err instanceof Error ? err.message : 'Ошибка при загрузке');
        } finally {
            setIsPreviewLoading(false);
        }
    };

    // СТАЛО — извлекаем из title
    const extractPriceFromTitle = (title: string): string | null => {
        // Ищем "за" + пробел + цифры
        const match = title?.match(/за\s+(\d+)/);
        if (match) {
            return match[1]; // Возвращает "41500000"
        }
        return null;
    };

    // В компоненте, когда получаете данные:
    const priceFromTitle = extractPriceFromTitle(previewData?.title);

    // Состояние для текущего индекса фото
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Сброс индекса при изменении данных
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [previewData]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Cluely Style */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-tight tracking-tight">
                                    Перестаньте тратить время на тех, кто просто спрашивает цену
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                    Создайте свой личный каталог недвижимости за 10 минут — и получайте только реальных покупателей, которые уже всё сравнили и готовы к сделке.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-black hover:bg-gray-900 text-white font-medium py-4 px-8 rounded-lg text-lg transition-all duration-300 border border-transparent hover:border-gray-700"
                                >
                                    Попробовать бесплатно
                                </motion.button>
                                <p className="text-gray-500 text-sm">
                                    5 дней. Без привязки карты. Регистрация по SMS.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="relative"
                        >
                            {/* Cluely-style video container */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                                <video
                                    src="https://cluely.com/videos/home/hero-v2/pro-res-vp9-chrome.webm"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-auto object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLVideoElement;
                                        target.src = "https://placehold.co/800x600/f8fafc/64748b?text=JUZ+Real+Estate";
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Problem Section - Cluely Cards */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                            Вы знаете это чувство?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Результат: вы устали, нервы на пределе, а реальные клиенты теряются в шуме
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {problemItems.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-300">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors duration-300">
                                        <item.icon className="w-7 h-7 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* === НОВЫЙ: ДЕМО-КАТАЛОГ И КЛИЕНТСКИЙ ОПЫТ === */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                            Вот как выглядит ваш каталог для клиента
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Он сам выбирает, сравнивает, смотрит видео и оставляет заявку — без вашего участия.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {clientExperienceItems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-200"
                            >
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 text-center">
                                    <p className="text-gray-700 font-medium">{item.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Демо-каталог */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full mx-auto"
                    >
                        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg relative">
                            {/* Контейнер с iframe */}
                            <div className="aspect-video bg-gray-900 relative">
                                <iframe
                                    src="https://juz-realestate.kz/"
                                    title="Демо каталог JUZ"
                                    className="w-full h-full"
                                    style={{ border: 'none' }}
                                    loading="lazy"
                                    allowFullScreen
                                />

                                {/* Оверлей с блюром и кнопкой (пока не разблокировано) */}
                                {!isDemoUnlocked && (
                                    <motion.div
                                        initial={{ backdropFilter: 'blur(8px)', opacity: 1 }}
                                        animate={{ backdropFilter: isDemoUnlocked ? 'blur(0px)' : 'blur(8px)' }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center z-10"
                                    >
                                        <Globe className="w-12 h-12 text-white/80 mb-4" />
                                        <h3 className="text-xl font-medium text-white mb-2">Демо каталог JUZ</h3>
                                        <p className="text-white/90 mb-6 max-w-md">
                                            Это реальный каталог риэлтора из Алматы. Нажмите, чтобы попробовать его как клиент.
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setIsDemoUnlocked(true)}
                                            className="bg-white text-blue-600 font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-gray-100 transition-all"
                                        >
                                            Посмотреть в действии
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>

                            {/* Подпись */}
                            <p className="text-center text-sm text-gray-500 pt-3 pb-2">
                                {isDemoUnlocked
                                    ? "Вы в демо-режиме. Попробуйте фильтры, карту и калькулятор ипотеки."
                                    : "Нажмите «Посмотреть в действии», чтобы взаимодействовать с каталогом"}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Solution Section — небольшое усиление */}
            <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
                            Ваш личный каталог недвижимости — работает за вас 24/7
                        </h2>
                        <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Покупатель сам выбирает объекты из вашей базы (не из Kolesa!), сравнивает, сортирует, смотрит видео-туры, считает ипотеку прямо на сайте и оставляет заявку, только если действительно хочет купить.
                        </p>
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                            <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                            <span className="font-medium text-white">
                                Вы получаете только горячие заявки — без "просто посмотреть"
                            </span>
                        </div>
                        {/* НОВОЕ: цифры результата */}
                        <div className="mt-8 text-white/90">
                            <p>✅ В среднем: <strong>5–8 заявок в неделю</strong> на риэлтора</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works - Minimal Steps */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                            Как это работает
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-12"
                        >
                            {steps.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex items-start space-x-6"
                                >
                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                                        <span className="text-2xl font-light text-gray-700">{item.step}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-medium text-gray-900 mb-3">{item.title}</h3>
                                        <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl max-w-lg mx-auto">
                                <div className="space-y-4">
                                    <input
                                        type="url"
                                        placeholder="https://krisha.kz/a/show/123456789"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                        value={previewUrl}
                                        onChange={(e) => setPreviewUrl(e.target.value)}
                                    />

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePreview}
                                        disabled={isPreviewLoading || !previewUrl.trim()}
                                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${isPreviewLoading || !previewUrl.trim()
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                    >
                                        {isPreviewLoading ? 'Загрузка...' : 'Посмотреть, как будет выглядеть'}
                                    </motion.button>
                                </div>

                                {previewData && !isPreviewLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                                    >
                                        {/* Фото с стрелками */}
                                        <div className="relative h-56 w-full bg-gray-100">
                                            {previewData.images?.length > 0 ? (
                                                <>
                                                    {/* Текущее фото */}
                                                    <motion.img
                                                        key={currentImageIndex}
                                                        src={previewData.images[currentImageIndex]}
                                                        alt={`Фото ${currentImageIndex + 1}`}
                                                        className="w-full h-full object-cover"
                                                        initial={{ opacity: 0, x: 50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -50 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "https://placehold.co/600x300/e2e8f0/64748b?text=Фото+недоступно";
                                                        }}
                                                    />

                                                    {/* Стрелка влево */}
                                                    {previewData.images.length > 1 && currentImageIndex > 0 && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </motion.button>
                                                    )}

                                                    {/* Стрелка вправо */}
                                                    {previewData.images.length > 1 && currentImageIndex < previewData.images.length - 1 && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </motion.button>
                                                    )}

                                                    {/* Индикаторы точек */}
                                                    {previewData.images.length > 1 && (
                                                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                                            {Array.from({ length: previewData.images.length }).map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/60'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">Нет фото</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Контент */}
                                        <div className="p-4 space-y-2">
                                            {/* Заголовок */}
                                            <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                                                {(() => {
                                                    const title = previewData.title || '';
                                                    let clean = title
                                                        .replace(/^Продажа\s+/i, '')
                                                        .replace(/\s*—\s*за\s+\d+\s*—\s*Крыша$/, '')
                                                        .replace(/\s*—\s*за\s+\d+$/, '');
                                                    return clean;
                                                })()}
                                            </h4>

                                            {/* Локация */}
                                            <p className="text-xs text-gray-500">
                                                {previewData.description?.includes('Астана') ? 'Астана' : 'Алматы'}
                                            </p>

                                            {/* Цена — акцент */}
                                            <p className="text-xl font-bold text-blue-600 mt-1">
                                                {(() => {
                                                    const match = previewData.title.match(/за\s+(\d+)/);
                                                    if (match) {
                                                        return `${parseInt(match[1]).toLocaleString()} ₸`;
                                                    }
                                                    return 'Цена не указана';
                                                })()}
                                            </p>

                                            {/* Краткое описание */}
                                            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                                {previewData.description?.substring(0, 70) || 'Описание недоступно'}...
                                            </p>

                                            {/* Кнопка */}
                                            <a
                                                href={previewData.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center text-xs text-blue-600 font-medium py-2 px-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors mt-2"
                                            >
                                                Посмотреть объявление
                                            </a>
                                        </div>
                                    </motion.div>
                                )}

                                {previewError && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-4 text-sm text-red-600 text-center"
                                    >
                                        {previewError}
                                    </motion.p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section - Clean Grid */}
            <section className="py-32 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                            Что вы получаете
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {features.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl p-8 h-full border border-gray-200 transition-all duration-300 group-hover:shadow-lg">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors duration-300">
                                        <item.icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-4">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* === УЛУЧШЕННЫЙ Pricing Section === */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                            Простые и честные тарифы
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            За 9 990 тг/мес вы экономите 10+ часов в неделю. Один клиент = 5 млн тг. Окупаемость — за 1 день.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                    >
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className={`bg-white rounded-3xl p-10 h-full border-2 ${plan.popular ? 'border-blue-500 shadow-xl relative' : 'border-gray-200'}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                                        Хит продаж!
                                    </div>
                                )}
                                <h3 className="text-2xl font-medium text-gray-900 mb-6">{plan.name}</h3>
                                <div className="mb-8">
                                    <span className="text-5xl font-light text-gray-900">{plan.price}</span>
                                    {plan.name === "Стандарт" && (
                                        <p className="text-sm text-gray-500 mt-2">≈ 333 тг в день</p>
                                    )}
                                </div>
                                <ul className="space-y-4 mb-10">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 ${plan.popular
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
                                        }`}
                                >
                                    {plan.cta}
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* === УЛУЧШЕННЫЙ Social Proof === */}
            <section className="py-32 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                            Уже 12 риэлторов из Алматы и Астаны используют JUZ
                        </h2>
                        <p className="text-xl text-gray-600">
                            Вместе они получили <strong>142 заявки</strong> за последний месяц. <strong>31 сделка</strong> завершена.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                        {testimonials.map((t, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-white rounded-3xl p-8 text-left border border-gray-200 shadow-lg"
                            >
                                <div className="flex items-center mb-6">
                                    <img
                                        src={t.photo}
                                        alt={t.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">{t.name}</p>
                                        <p className="text-gray-600 text-sm">{t.role}, {t.city}</p>
                                    </div>
                                </div>
                                <blockquote className="text-lg text-gray-900 italic mb-4 leading-relaxed">
                                    {t.quote}
                                </blockquote>
                                <p className="text-sm text-gray-600 font-medium">{t.stats}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === НОВЫЙ: Сообщество и поддержка === */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">
                            Вы не одни
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            Присоединяйтесь к закрытому чату риэлторов JUZ — делитесь кейсами, получайте советы и первыми узнавайте о новых функциях.
                        </p>
                        <motion.a
                            href="https://t.me/juz_realtors"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-xl text-lg transition-all duration-300"
                        >
                            <MessageCircle className="w-5 h-5 mr-3" />
                            Вступить в Telegram-чат
                        </motion.a>
                        <p className="text-gray-500 mt-4 text-sm">
                            Поддержка 24/7 · Еженедельные вебинары · Обмен опытом
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA — усиленный */}
            <section className="py-32 bg-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
                            Попробуйте 5 дней бесплатно. Если не получите хотя бы 1 реальную заявку — вы ничего не потеряете
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            animate={{
                                scale: [1, 1.02, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="bg-white text-black hover:bg-gray-100 font-medium py-4 px-8 rounded-lg text-lg transition-all duration-300 border border-white"
                        >
                            Получить свой каталог и первую заявку
                        </motion.button>
                        <p className="text-gray-400 mt-6">
                            Отмена в 1 клик. Без скрытых платежей
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default App;