// components/PricingSection.tsx
import React from 'react';
import { Check, Star } from 'lucide-react';
import { B_W_COLORS } from './utils';
import { AnimateOnScroll } from './AnimateOnScroll';
import { GlassCard } from './GlassCard';
import { CTAButton } from './CTAButton';
import { useAccentColor } from './AccentColorContext';
import { motion } from 'framer-motion';

interface PricingCardProps {
    title: string;
    price: string;
    features: string[];
    isHit: boolean;
    index: number;
    onCtaClick: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, isHit, index, onCtaClick }) => {
    const { accentColor } = useAccentColor();

    return (
        <AnimateOnScroll delay={index * 0.1} y={50} scale={1}>
            <GlassCard
                className={`flex flex-col h-full transition-all ${isHit ? 'border-white border-2' : ''}`}
                motionProps={{
                    // Усиленное свечение для хита продаж
                    whileHover: isHit ? { boxShadow: `0 0 25px ${accentColor}`, scale: 1.03 } : {}
                }}
            >
                <div className="mb-6">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    {isHit && (
                        <motion.span
                            className="inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-white text-black shadow-md"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Star className='w-4 h-4 inline mr-1 text-yellow-500' /> Хит продаж!
                        </motion.span>
                    )}
                </div>
                <div className="text-5xl font-extrabold mb-4">
                    {price}
                    <span className={`text-xl font-normal ${B_W_COLORS.textSecondary}`}>/мес</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                    {features.map((feat, i) => (
                        <li key={i} className="flex items-start space-x-2">
                            <Check className={`w-5 h-5 flex-shrink-0 mt-1`} style={{ color: accentColor }} />
                            <span className={B_W_COLORS.textSecondary}>{feat}</span>
                        </li>
                    ))}
                </ul>
                <CTAButton onClick={onCtaClick} className="w-full">
                    {title === 'Бесплатный' ? 'Начать бесплатно' : 'Купить тариф'}
                </CTAButton>
            </GlassCard>
        </AnimateOnScroll>
    );
};

interface PricingSectionProps {
    onCtaClick: () => void;
}

// --- PricingSection ---
export const PricingSection: React.FC<PricingSectionProps> = ({ onCtaClick }) => {
    const plans = [
        {
            title: 'Бесплатный', price: '0₸', isHit: false,
            features: ['1 объявление', 'Базовая фильтрация', 'Мобильный доступ', '5 дней демо'],
        },
        {
            title: 'Стандарт', price: '14 990₸', isHit: true,
            features: ['До 10 объявлений', 'Продвинутая фильтрация', 'Аналитика лидов', 'CRM-интеграция (базовая)'],
        },
        {
            title: 'Профессионал', price: '29 990₸', isHit: false,
            features: ['Неограниченно объявлений', 'Приоритетная поддержка', 'Автоматический импорт', 'Полная CRM-интеграция'],
        },
    ];

    return (
        // Чередование фона: bgDarker (#0a0a0a)
        <section className={`py-20 lg:py-28 ${B_W_COLORS.bgDarker} ${B_W_COLORS.textPrimary}`}>
            <div className="max-w-7xl mx-auto px-4">
                <AnimateOnScroll y={30}>
                    <h2 className="text-4xl font-bold text-center mb-16">Выберите свой план</h2>
                </AnimateOnScroll>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <PricingCard key={index} {...plan} index={index} onCtaClick={onCtaClick} />
                    ))}
                </div>
            </div>
        </section>
    );
};