// components/ClientInterfaceDemoSection.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Building, Star, Loader2, Calculator, TrendingDown, Clock, Info, X } from 'lucide-react';
import { B_W_COLORS } from './utils';
import { AnimateOnScroll } from './AnimateOnScroll';
import { GlassCard } from './GlassCard';
import { CTAButton } from './CTAButton';
import { useAccentColor } from './AccentColorContext';

interface Bank {
    name: string;
    rate: number;
    logo: string;
    maxLoan: number;
    minDownPayment: number;
}

interface Flat {
    id: number;
    name: string;
    price: number;
    bank: string;
    payment: number;
    rate: number;
    img: string;
    desc: string;
    rating: number;
    district: string;
    rooms: number;
    area: number;
    loanAmount: number;
    totalOverpayment: number;
    totalPayment: number;
    loanTerm: number;
}

interface RangeInfo {
    minPay: number;
    maxPay: number;
    downPercent: number;
    totalPrice: number;
    approvedLoan: number;
}

interface MortgageCalculation {
    loanAmount: number;
    monthlyPayment: number;
    totalOverpayment: number;
    totalPayment: number;
    effectiveRate: number;
    paymentSchedule: { month: number; principal: number; interest: number; balance: number }[];
}

export const ClientInterfaceDemoSection: React.FC = () => {
    const { accentColor } = useAccentColor();
    const [initialPayment, setInitialPayment] = useState<string>('4 000 000');
    const [monthlyIncome, setMonthlyIncome] = useState<string>('600 000');
    const [loanTerm, setLoanTerm] = useState<number>(20);
    const [selectedBank, setSelectedBank] = useState<string>('all');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [results, setResults] = useState<Flat[]>([]);
    const [loadedCount, setLoadedCount] = useState<number>(0);
    const [rangeInfo, setRangeInfo] = useState<RangeInfo | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
    const [showCalculation, setShowCalculation] = useState<boolean>(false);
    const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);
    const [activeTab, setActiveTab] = useState<'flats' | 'calculator'>('flats');

    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 50000000,
        banks: [] as string[],
        districts: [] as string[],
        rooms: [] as number[],
        sortBy: 'price' as 'price' | 'payment' | 'rating' | 'overpayment',
        showFilters: true
    });

    const banks: Bank[] = [
        { name: 'Halyk Bank', rate: 10.2, logo: '🏦', maxLoan: 50000000, minDownPayment: 15 },
        { name: 'Otbasy Bank', rate: 9.8, logo: '🏠', maxLoan: 45000000, minDownPayment: 10 },
        { name: 'Freedom Finance', rate: 10.9, logo: '💎', maxLoan: 60000000, minDownPayment: 20 },
        { name: 'Kaspi Bank', rate: 11.5, logo: '💳', maxLoan: 40000000, minDownPayment: 15 },
    ];

    const districts = ['Алмалы', 'Бостандык', 'Медеу', 'Ауэзов', 'Наурызбай', 'Алатау'];
    const roomOptions = [1, 2, 3, 4];
    const complexNames = ['AlmaCity', 'Nova', 'Seven Hills', 'SkyPark', 'GreenTown', 'EcoVillage'];

    const mockImages = [
        'https://astps-photos-kr.kcdn.kz/webp/74/740c8da3-dcd6-4342-8728-08d2022a4c1c/1-750x470.webp',
        'https://astps-photos-kr.kcdn.kz/webp/bc/bc97daeb-1943-4c0c-9fa1-9fa100d11282/5-750x470.webp',
        'https://astps-photos-kr.kcdn.kz/webp/d6/d65989d5-2b61-4f72-bccb-f74919de7974/1-750x470.webp',
        'https://astps-photos-kr.kcdn.kz/webp/6b/6b907270-7cf4-46c0-bc56-6e4d62ea258e/22-750x470.webp',
        'https://astps-photos-kr.kcdn.kz/webp/3b/3ba15f4e-16be-4e76-9614-be8cba35e7fd/1-750x470.webp',
    ];

    // Форматирование чисел
    const formatNumber = (value: string): string =>
        value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';

    const handleNumberInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const numeric = e.target.value.replace(/\s/g, '');
        if (/^\d*$/.test(numeric)) setter(formatNumber(numeric));
    };

    // Расчет аннуитетного платежа
    const calcMonthlyPayment = (loanAmount: number, annualRate: number, years: number): number => {
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;
        return loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    };

    // Детальный расчет ипотеки с графиком платежей
    const calculateMortgageDetails = (loanAmount: number, annualRate: number, years: number): MortgageCalculation => {
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;
        const monthlyPayment = calcMonthlyPayment(loanAmount, annualRate, years);

        let balance = loanAmount;
        const paymentSchedule = [];
        let totalInterest = 0;

        for (let month = 1; month <= numberOfPayments; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            totalInterest += interestPayment;
            balance -= principalPayment;

            paymentSchedule.push({
                month,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(0, balance)
            });
        }

        return {
            loanAmount,
            monthlyPayment,
            totalOverpayment: totalInterest,
            totalPayment: loanAmount + totalInterest,
            effectiveRate: annualRate,
            paymentSchedule: paymentSchedule.slice(0, 60) // Показываем первые 5 лет
        };
    };

    // Генерация моковых данных
    const generateMockFlats = (initial: string, income: string, minPay: number, maxPay: number, term: number): Flat[] => {
        const init = parseInt(initial.replace(/\s/g, '')) || 0;
        const inc = parseInt(income.replace(/\s/g, '')) || 0;
        const flats: Flat[] = [];

        const complexRatings = {
            'AlmaCity': 4.8,
            'Nova': 4.6,
            'Seven Hills': 4.9,
            'SkyPark': 4.7,
            'GreenTown': 4.5,
            'EcoVillage': 4.4
        };

        for (let i = 0; i < 25; i++) {
            const bank = banks[Math.floor(Math.random() * banks.length)];
            const minPrice = init / (bank.minDownPayment / 100);
            const maxPrice = minPrice * 3;
            const price = Math.round((minPrice + Math.random() * (maxPrice - minPrice)) / 1000) * 1000;

            if (price < init) continue;

            const loanAmount = price - init;
            const monthlyPayment = calcMonthlyPayment(loanAmount, bank.rate, term);
            const totalOverpayment = monthlyPayment * term * 12 - loanAmount;

            if (monthlyPayment >= minPay * 0.7 && monthlyPayment <= maxPay * 1.3) {
                const complexName = complexNames[i % complexNames.length];
                flats.push({
                    id: i + 1,
                    name: `ЖК ${complexName} ${Math.ceil(Math.random() * 3)}`,
                    price,
                    bank: bank.name,
                    payment: Math.round(monthlyPayment),
                    rate: bank.rate,
                    img: mockImages[i % mockImages.length],
                    desc: [
                        'Современный жилой комплекс в центре города с развитой инфраструктурой.',
                        'Удобная транспортная развязка и парковые зоны для комфортной жизни.',
                        'Просторные планировки с панорамными окнами и современной отделкой.',
                        'Идеально подходит для семьи с детьми, рядом школы и детские сады.',
                        'В шаговой доступности школы, парки и торговые центры.',
                        'Экологичный район с парковыми зонами и зонами для отдыха.',
                    ][i % 6],
                    rating: complexRatings[complexName as keyof typeof complexRatings],
                    district: districts[Math.floor(Math.random() * districts.length)],
                    rooms: Math.floor(Math.random() * 3) + 1,
                    area: Math.floor(Math.random() * 40) + 40,
                    loanAmount,
                    totalOverpayment: Math.round(totalOverpayment),
                    totalPayment: Math.round(price + totalOverpayment),
                    loanTerm: term
                });
            }
        }

        return flats.slice(0, 20);
    };

    // Обработка расчета
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setResults([]);
        setLoadedCount(0);
        setRangeInfo(null);
        setProgress(0);
        setActiveTab('flats');

        const init = parseInt(initialPayment.replace(/\s/g, '')) || 0;
        const inc = parseInt(monthlyIncome.replace(/\s/g, '')) || 0;
        if (!init || !inc) return;

        // Расчет комфортного платежа (30-45% от дохода)
        const minPayment = inc * 0.30;
        const maxPayment = inc * 0.45;

        // Расчет максимальной суммы кредита
        const avgRate = banks.reduce((sum, bank) => sum + bank.rate, 0) / banks.length;
        const maxLoanFromPayment = calcMonthlyPayment(1000000, avgRate, loanTerm) > 0 ?
            maxPayment / (calcMonthlyPayment(1000000, avgRate, loanTerm) / 1000000) : 0;

        const totalPrice = init + maxLoanFromPayment;
        const downPercent = Math.round((init / totalPrice) * 100);

        setRangeInfo({
            minPay: Math.round(minPayment),
            maxPay: Math.round(maxPayment),
            downPercent,
            totalPrice: Math.round(totalPrice),
            approvedLoan: Math.round(maxLoanFromPayment)
        });

        const flats = generateMockFlats(initialPayment, monthlyIncome, minPayment, maxPayment, loanTerm);

        // Анимация прогресса
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + Math.random() * 10 + 5;
            });
        }, 200);

        // Постепенная загрузка результатов
        setTimeout(() => {
            let index = 0;
            const interval = setInterval(() => {
                const nextBatch = flats.slice(index, index + 2);
                setResults(prev => [...prev, ...nextBatch]);
                index += 2;
                setLoadedCount(index);

                if (index >= flats.length) {
                    setProgress(100);
                    setTimeout(() => {
                        clearInterval(interval);
                        clearInterval(progressInterval);
                        setIsLoading(false);
                    }, 500);
                }
            }, 800);
        }, 1000);
    };

    // Обработчик выбора квартиры для детального расчета
    const handleFlatSelect = (flat: Flat) => {
        setSelectedFlat(flat);
        const bank = banks.find(b => b.name === flat.bank);
        if (bank) {
            const calculation = calculateMortgageDetails(flat.loanAmount, bank.rate, flat.loanTerm);
            setCalculation(calculation);
            setShowCalculation(true);
        }
    };

    // Фильтрация и сортировка результатов
    const filteredResults = results.filter(flat => {
        const priceMatch = flat.price >= filters.minPrice && flat.price <= filters.maxPrice;
        const bankMatch = filters.banks.length === 0 || filters.banks.includes(flat.bank);
        const districtMatch = filters.districts.length === 0 || filters.districts.includes(flat.district);
        const roomMatch = filters.rooms.length === 0 || filters.rooms.includes(flat.rooms);
        return priceMatch && bankMatch && districtMatch && roomMatch;
    });

    const sortedResults = [...filteredResults].sort((a, b) => {
        switch (filters.sortBy) {
            case 'price': return a.price - b.price;
            case 'payment': return a.payment - b.payment;
            case 'rating': return b.rating - a.rating;
            case 'overpayment': return a.totalOverpayment - b.totalOverpayment;
            default: return 0;
        }
    });

    return (
        <section className={`py-20 lg:py-28 ${B_W_COLORS.bgDarkest} ${B_W_COLORS.textPrimary}`}>
            <div className="max-w-7xl mx-auto px-4">
                <AnimateOnScroll y={30}>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Полный контроль над вашей ипотекой</h2>
                        <p className={`text-lg ${B_W_COLORS.textSecondary} max-w-3xl mx-auto`}>
                            Рассчитайте все варианты, посмотрите переплату, измените параметры — и всё это в реальном времени.
                            Ваш клиент получит полную картину перед принятием решения.
                        </p>
                    </div>
                </AnimateOnScroll>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Левая колонка - калькулятор и фильтры */}
                    <div className="lg:col-span-1 space-y-6">
                        <GlassCard className='p-6!'>
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Calculator className="w-5 h-5 mr-2" style={{ color: accentColor }} />
                                Параметры ипотеки
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Первоначальный взнос, ₸
                                    </label>
                                    <input
                                        type="text"
                                        value={initialPayment}
                                        onChange={handleNumberInput(setInitialPayment)}
                                        className="w-full p-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white transition"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Рекомендуем от 15% от стоимости квартиры
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Ежемесячный доход, ₸
                                    </label>
                                    <input
                                        type="text"
                                        value={monthlyIncome}
                                        onChange={handleNumberInput(setMonthlyIncome)}
                                        className="w-full p-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white transition"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Чистый доход после вычета налогов
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Срок кредита, лет
                                    </label>
                                    <select
                                        value={loanTerm}
                                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                                        className="w-full p-3 rounded-xl bg-black/30 border border-white/20 text-white"
                                    >
                                        <option value={5}>5 лет</option>
                                        <option value={10}>10 лет</option>
                                        <option value={15}>15 лет</option>
                                        <option value={20}>20 лет</option>
                                        <option value={25}>25 лет</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Предпочтительный банк
                                    </label>
                                    <select
                                        value={selectedBank}
                                        onChange={(e) => setSelectedBank(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-black/30 border border-white/20 text-white"
                                    >
                                        <option value="all">Все банки</option>
                                        {banks.map(bank => (
                                            <option key={bank.name} value={bank.name}>
                                                {bank.name} ({bank.rate}%)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <CTAButton type="submit" className="w-full">
                                    <Calculator className="w-4 h-4 mr-2" />
                                    Рассчитать варианты
                                </CTAButton>
                            </form>
                        </GlassCard>

                        {/* Фильтры */}
                        <GlassCard className='p-6!'>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold flex items-center">
                                    <Filter className="w-5 h-5 mr-2" style={{ color: accentColor }} />
                                    Фильтры
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {/* Сортировка */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Сортировка
                                    </label>
                                    <select
                                        className="w-full p-3 rounded-xl bg-black/30 border border-white/20 text-white"
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                                    >
                                        <option value="price">По цене</option>
                                        <option value="payment">По платежу</option>
                                        <option value="rating">По рейтингу</option>
                                        <option value="overpayment">По переплате</option>
                                    </select>
                                </div>

                                {/* Цена */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Цена, ₸
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            placeholder="От"
                                            className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white text-sm"
                                            value={filters.minPrice}
                                            onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                                        />
                                        <input
                                            type="number"
                                            placeholder="До"
                                            className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white text-sm"
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                {/* Количество комнат */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Комнаты
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {roomOptions.map(rooms => (
                                            <label key={rooms} className="flex items-center text-sm">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={filters.rooms.includes(rooms)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters({ ...filters, rooms: [...filters.rooms, rooms] });
                                                        } else {
                                                            setFilters({ ...filters, rooms: filters.rooms.filter(r => r !== rooms) });
                                                        }
                                                    }}
                                                />
                                                <span>{rooms} комн.</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Банки */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Банки
                                    </label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {banks.map(bank => (
                                            <label key={bank.name} className="flex items-center text-sm">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={filters.banks.includes(bank.name)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters({ ...filters, banks: [...filters.banks, bank.name] });
                                                        } else {
                                                            setFilters({ ...filters, banks: filters.banks.filter(b => b !== bank.name) });
                                                        }
                                                    }}
                                                />
                                                <span>{bank.name} ({bank.rate}%)</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Районы */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Районы
                                    </label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {districts.map(district => (
                                            <label key={district} className="flex items-center text-sm">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={filters.districts.includes(district)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFilters({ ...filters, districts: [...filters.districts, district] });
                                                        } else {
                                                            setFilters({ ...filters, districts: filters.districts.filter(d => d !== district) });
                                                        }
                                                    }}
                                                />
                                                <span>{district}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Правая колонка - результаты */}
                    <div className="lg:col-span-3">
                        {/* Табы для переключения между режимами */}
                        <div className="flex mb-6 bg-white/5 rounded-2xl p-1">
                            <button
                                onClick={() => setActiveTab('flats')}
                                className={`flex-1 py-3 px-4 rounded-xl text-center transition-colors ${activeTab === 'flats'
                                    ? 'bg-white/10 text-white font-semibold'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                📊 Подобранные варианты
                            </button>
                            <button
                                onClick={() => setActiveTab('calculator')}
                                className={`flex-1 py-3 px-4 rounded-xl text-center transition-colors ${activeTab === 'calculator'
                                    ? 'bg-white/10 text-white font-semibold'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                🧮 Детальный калькулятор
                            </button>
                        </div>

                        {/* Информация о расчёте */}
                        {rangeInfo && (
                            <GlassCard className="mb-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-400">Ваш бюджет</p>
                                        <p className="text-xl font-semibold" style={{ color: accentColor }}>
                                            {rangeInfo.totalPrice.toLocaleString()}₸
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Одобрено банками</p>
                                        <p className="text-xl font-semibold" style={{ color: accentColor }}>
                                            {rangeInfo.approvedLoan.toLocaleString()}₸
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Ежемесячный платёж</p>
                                        <p className="text-xl font-semibold" style={{ color: accentColor }}>
                                            {rangeInfo.minPay.toLocaleString()}₸ – {rangeInfo.maxPay.toLocaleString()}₸
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Первоначальный взнос</p>
                                        <p className="text-xl font-semibold" style={{ color: accentColor }}>
                                            {rangeInfo.downPercent}%
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        )}

                        {/* Прогресс бар */}
                        {isLoading && (
                            <GlassCard className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Loader2 className="w-5 h-5" style={{ color: accentColor }} />
                                        </motion.div>
                                        <div>
                                            <p className="font-semibold text-white">Ищем лучшие варианты</p>
                                            <p className="text-sm text-gray-400">Анализируем 25+ параметров для точного подбора</p>
                                        </div>
                                    </div>
                                    <motion.span
                                        className="text-sm font-semibold"
                                        style={{ color: accentColor }}
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        {Math.round(progress)}%
                                    </motion.span>
                                </div>

                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        className="h-full rounded-full relative"
                                        style={{ backgroundColor: accentColor }}
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <motion.div
                                            className="absolute top-0 left-0 w-1/3 h-full bg-white/30 rounded-full"
                                            animate={{ x: ["-100%", "300%"] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </motion.div>
                                </div>

                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Проверяем банки</span>
                                    <span>Подбираем квартиры</span>
                                    <span>Считаем ипотеку</span>
                                    <span>Анализируем условия</span>
                                </div>
                            </GlassCard>
                        )}

                        {/* Режим просмотра квартир */}
                        {activeTab === 'flats' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                                {sortedResults.map((flat) => (
                                    <motion.div
                                        key={flat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <GlassCard
                                            className="overflow-hidden p-4! cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                                            onClick={() => handleFlatSelect(flat)}
                                        >
                                            <div className="relative">
                                                <img src={flat.img} alt={flat.name} className="w-full h-48 object-cover rounded-xl" />
                                                <div className="absolute top-3 right-3 bg-black/70 rounded-full px-2 py-1 flex items-center">
                                                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                                    <span className="text-white text-sm">{flat.rating}</span>
                                                </div>
                                                <div className="absolute bottom-3 left-3 flex space-x-2">
                                                    <span className="bg-blue-500/80 text-white px-2 py-1 rounded text-sm">
                                                        {flat.district}
                                                    </span>
                                                    <span className="bg-green-500/80 text-white px-2 py-1 rounded text-sm">
                                                        {flat.rooms} комн.
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-2">{flat.name}</h3>
                                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{flat.desc}</p>

                                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                    <div className="flex items-center text-gray-400">
                                                        <Building className="w-4 h-4 mr-1" />
                                                        {flat.area} м²
                                                    </div>
                                                    <div className="flex items-center text-gray-400">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {flat.loanTerm} лет
                                                    </div>
                                                </div>

                                                <div className="space-y-2 border-t border-white/10 pt-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400">Цена квартиры:</span>
                                                        <span className="font-semibold text-lg">{flat.price.toLocaleString()}₸</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Ежемесячный платёж:</span>
                                                        <span className="font-semibold" style={{ color: accentColor }}>
                                                            {flat.payment.toLocaleString()}₸/мес
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Банк:</span>
                                                        <span className="text-sm">{flat.bank} ({flat.rate}%)</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">Переплата:</span>
                                                        <span className="text-orange-400">
                                                            {flat.totalOverpayment.toLocaleString()}₸
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-400">Общая сумма:</span>
                                                        <span className="text-green-400">
                                                            {flat.totalPayment.toLocaleString()}₸
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    className="w-full mt-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
                                                    style={{ color: accentColor }}
                                                >
                                                    Посмотреть детальный расчет
                                                </button>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Режим детального калькулятора */}
                        {activeTab === 'calculator' && calculation && (
                            <GlassCard className="p-6!">
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <TrendingDown className="w-5 h-5 mr-2" style={{ color: accentColor }} />
                                    Детальный расчет ипотеки
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                            <span className="text-gray-400">Сумма кредита:</span>
                                            <span className="font-semibold">{calculation.loanAmount.toLocaleString()}₸</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                            <span className="text-gray-400">Ежемесячный платёж:</span>
                                            <span className="font-semibold" style={{ color: accentColor }}>
                                                {Math.round(calculation.monthlyPayment).toLocaleString()}₸
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                            <span className="text-gray-400">Общая переплата:</span>
                                            <span className="text-orange-400 font-semibold">
                                                {Math.round(calculation.totalOverpayment).toLocaleString()}₸
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                            <span className="text-gray-400">Общая сумма выплат:</span>
                                            <span className="text-green-400 font-semibold">
                                                {Math.round(calculation.totalPayment).toLocaleString()}₸
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <h4 className="font-semibold mb-2 flex items-center">
                                                <Info className="w-4 h-4 mr-2" />
                                                Эффективная ставка
                                            </h4>
                                            <p className="text-2xl font-bold" style={{ color: accentColor }}>
                                                {calculation.effectiveRate}%
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">годовых с учетом всех платежей</p>
                                        </div>

                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <h4 className="font-semibold mb-2">График платежей (первые 5 лет)</h4>
                                            <div className="max-h-40 overflow-y-auto space-y-2">
                                                {calculation.paymentSchedule.map((payment) => (
                                                    <div key={payment.month} className="flex justify-between text-sm border-b border-white/5 pb-1">
                                                        <span>Месяц {payment.month}</span>
                                                        <span>{Math.round(payment.principal + payment.interest).toLocaleString()}₸</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4">
                                    <h4 className="font-semibold mb-3">Что можно изменить?</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <button
                                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors"
                                            onClick={() => {
                                                const newInitial = (parseInt(initialPayment.replace(/\s/g, '')) + 1000000).toString();
                                                setInitialPayment(formatNumber(newInitial));
                                            }}
                                        >
                                            +1 млн к взносу
                                        </button>
                                        <button
                                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors"
                                            onClick={() => setLoanTerm(prev => Math.min(30, prev + 5))}
                                        >
                                            +5 лет к сроку
                                        </button>
                                        <button
                                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors"
                                            onClick={() => {
                                                const newIncome = (parseInt(monthlyIncome.replace(/\s/g, '')) + 50000).toString();
                                                setMonthlyIncome(formatNumber(newIncome));
                                            }}
                                        >
                                            +50к к доходу
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        )}

                        {/* Модальное окно с детальным расчетом */}
                        <AnimatePresence>
                            {showCalculation && selectedFlat && calculation && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                                    onClick={() => setShowCalculation(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-2xl font-bold">Детальный расчет ипотеки</h3>
                                            <button
                                                onClick={() => setShowCalculation(false)}
                                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-lg font-semibold mb-4">Параметры квартиры</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Жилой комплекс:</span>
                                                        <span className="font-semibold">{selectedFlat.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Стоимость:</span>
                                                        <span className="font-semibold">{selectedFlat.price.toLocaleString()}₸</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Первоначальный взнос:</span>
                                                        <span className="font-semibold">{initialPayment}₸</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Сумма кредита:</span>
                                                        <span className="font-semibold">{selectedFlat.loanAmount.toLocaleString()}₸</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Банк:</span>
                                                        <span className="font-semibold">{selectedFlat.bank}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Ставка:</span>
                                                        <span className="font-semibold">{selectedFlat.rate}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Срок:</span>
                                                        <span className="font-semibold">{selectedFlat.loanTerm} лет</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-semibold mb-4">Финансовые показатели</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                                        <span className="text-gray-400">Ежемесячный платёж:</span>
                                                        <span className="text-xl font-bold" style={{ color: accentColor }}>
                                                            {Math.round(calculation.monthlyPayment).toLocaleString()}₸
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                                        <span className="text-gray-400">Общая переплата:</span>
                                                        <span className="text-xl font-bold text-orange-400">
                                                            {Math.round(calculation.totalOverpayment).toLocaleString()}₸
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                                        <span className="text-gray-400">Всего к выплате:</span>
                                                        <span className="text-xl font-bold text-green-400">
                                                            {Math.round(calculation.totalPayment).toLocaleString()}₸
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                                        <span className="text-gray-400">Эффективная ставка:</span>
                                                        <span className="text-xl font-bold" style={{ color: accentColor }}>
                                                            {calculation.effectiveRate}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h4 className="text-lg font-semibold mb-4">График платежей (первые 3 года)</h4>
                                            <div className="bg-white/5 rounded-xl p-4 max-h-60 overflow-y-auto">
                                                <div className="grid grid-cols-4 gap-4 mb-3 text-sm text-gray-400 font-semibold border-b border-white/10 pb-2">
                                                    <span>Месяц</span>
                                                    <span>Основной долг</span>
                                                    <span>Проценты</span>
                                                    <span>Остаток</span>
                                                </div>
                                                {calculation.paymentSchedule.slice(0, 36).map((payment) => (
                                                    <div key={payment.month} className="grid grid-cols-4 gap-4 py-2 text-sm border-b border-white/5">
                                                        <span>{payment.month}</span>
                                                        <span>{Math.round(payment.principal).toLocaleString()}₸</span>
                                                        <span>{Math.round(payment.interest).toLocaleString()}₸</span>
                                                        <span>{Math.round(payment.balance).toLocaleString()}₸</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3 mt-6">
                                            <button
                                                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                                                onClick={() => setShowCalculation(false)}
                                            >
                                                Закрыть
                                            </button>
                                            <CTAButton className="px-6 py-3">
                                                Подать заявку в банк
                                            </CTAButton>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CTA после загрузки */}
                        {loadedCount >= 20 && !isLoading && (
                            <AnimateOnScroll y={20} delay={0.3} className="mt-12 text-center">
                                <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold mb-4">Готовы внедрить такой подбор для ваших клиентов?</h3>
                                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                        Увеличьте конверсию в 3 раза, предоставив клиентам полный контроль над расчетом ипотеки.
                                        Прозрачность = доверие = продажи.
                                    </p>
                                    <CTAButton className="text-lg px-12 py-5">
                                        Хочу такой подбор для своего бизнеса
                                    </CTAButton>
                                </div>
                            </AnimateOnScroll>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};