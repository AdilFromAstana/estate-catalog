// components/TestimonialsSection.tsx
import React from 'react';
import { User, BarChart2 } from 'lucide-react';
import { B_W_COLORS } from './utils';
import { AnimateOnScroll } from './AnimateOnScroll';
import { GlassCard } from './GlassCard';
import { useAccentColor } from './AccentColorContext';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
    quote: string;
    name: string;
    leads: string;
    index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, leads, index }) => {
    const { accentColor } = useAccentColor();

    return (
        <AnimateOnScroll delay={index * 0.1} y={50}>
            <GlassCard className="text-center flex flex-col items-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-white/70 overflow-hidden bg-white/10 flex items-center justify-center">
                    <User className={`w-8 h-8 ${B_W_COLORS.textPrimary}`} />
                </div>
                <p className={`italic text-lg mb-4 ${B_W_COLORS.textPrimary}`}>"{quote}"</p>
                <p className={`font-semibold text-xl ${B_W_COLORS.textPrimary}`}>{name}</p>
                <motion.p
                    className={`text-sm ${B_W_COLORS.textSecondary} flex items-center justify-center mt-2 p-2 rounded-lg bg-white/5 border border-white/10`}
                    style={{ boxShadow: `0 0 5px ${accentColor}20` }}
                >
                    <BarChart2 className={`w-4 h-4 mr-1`} style={{ color: accentColor }} />
                    Увеличил лиды на <span className={`font-bold ml-1`} style={{ color: accentColor }}>{leads}</span>
                </motion.p>
            </GlassCard>
        </AnimateOnScroll>
    );
};

// --- TestimonialsSection ---
export const TestimonialsSection: React.FC = () => {
    const testimonials = [
        { quote: 'С JUZ я перестал отвечать на "просто спросить". Время на реальные сделки увеличилось вдвое.', name: 'Александр Б.', leads: '35%' },
        { quote: 'Умная фильтрация окупилась в первый же месяц. Это прорыв для рынка Казахстана!', name: 'Елена К.', leads: '42%' },
        { quote: 'Простой интерфейс, мощный функционал. Лучшая инвестиция в мой риэлторский бизнес.', name: 'Тимур С.', leads: '28%' },
    ];

    return (
        // Чередование фона: bgPure (black)
        <section className={`py-20 lg:py-28 ${B_W_COLORS.bgPure} ${B_W_COLORS.textPrimary}`}>
            <div className="max-w-7xl mx-auto px-4">
                <AnimateOnScroll y={30}>
                    <h2 className="text-4xl font-bold text-center mb-16">Отзывы наших клиентов</h2>
                </AnimateOnScroll>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <TestimonialCard key={index} {...t} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};