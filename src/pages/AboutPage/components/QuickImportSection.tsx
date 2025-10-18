// components/HowItWorksSection.tsx
import React from 'react';
import { Phone, Zap, Home, ChevronRight } from 'lucide-react';
import { B_W_COLORS } from './utils';
import { AnimateOnScroll } from './AnimateOnScroll';
import { GlassCard } from './GlassCard';
import { CTAButton } from './CTAButton';
import { LIQUID_SPRING } from './utils';
import { motion } from 'framer-motion';

// --- HowItWorksSection ---
// Внутри компонента QuickImportSection.tsx
export const QuickImportSection: React.FC = () => {
    const steps = [
        {
            num: 1,
            icon: Phone,
            title: 'Скопируйте ссылку с Krisha.kz',
            text: 'Не нужно ничего вводить вручную'
        },
        {
            num: 2,
            icon: Zap,
            title: 'Вставьте в поле справа',
            text: 'JUZ автоматически загрузит фото, описание и цену'
        },
        {
            num: 3,
            icon: Home,
            title: 'Получите "умную" ссылку',
            text: 'Замените ссылку в объявлении — объект начнёт фильтровать лиды'
        },
    ];

    return (
        <section className={`py-20 lg:py-28 ${B_W_COLORS.bgPure} ${B_W_COLORS.textPrimary}`}>
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Левая колонка */}
                <div className="space-y-10">
                    <AnimateOnScroll y={30}>
                        <h2 className="text-4xl font-bold mb-4">Подключите объект за 2 минуты</h2>
                        <p className={`text-lg ${B_W_COLORS.textSecondary}`}>
                            Не нужно создавать объявления заново. Просто скопируйте ссылки с Krisha.kz
                        </p>
                    </AnimateOnScroll>

                    {steps.map((step, index) => (
                        <AnimateOnScroll key={step.num} delay={index * 0.1} y={50}>
                            <div className="flex items-start space-x-6">
                                <motion.div
                                    className={`flex-shrink-0 w-14 h-14 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-2xl font-bold ${B_W_COLORS.textPrimary}`}
                                    whileHover={{ scale: 1.1 }}
                                    transition={LIQUID_SPRING}
                                >
                                    {step.num}
                                </motion.div>
                                <div>
                                    <p className={`text-xl font-medium ${B_W_COLORS.textPrimary} mb-1`}>
                                        {step.title}
                                    </p>
                                    <p className={`${B_W_COLORS.textSecondary}`}>
                                        {step.text}
                                    </p>
                                </div>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>

                {/* Правая колонка */}
                <AnimateOnScroll delay={0.3} y={50}>
                    <GlassCard>
                        <h3 className="text-2xl font-semibold mb-2">Попробуйте импорт</h3>
                        <p className={`text-sm ${B_W_COLORS.textSecondary} mb-6`}>
                            Вставьте ссылку от Krisha.kz — мы всё сделаем за вас
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3">
                            <input
                                type="url"
                                placeholder="https://krisha.kz/a/show/123456789"
                                className={`w-full p-4 rounded-xl text-lg text-white bg-black/40 border border-white/20 placeholder:text-gray-500 focus:border-white focus:ring-1 focus:ring-white transition duration-300`}
                            />
                            <CTAButton
                                className="w-full sm:w-14 sm:h-14 p-0 flex items-center justify-center flex-shrink-0 mt-2 sm:mt-0"
                                onClick={() => { }}
                            >
                                <ChevronRight className="w-6 h-6 text-black hover:text-white" />
                            </CTAButton>
                        </div>

                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-400 flex items-center">
                                <Zap className="w-4 h-4 mr-2" />
                                <strong>Автозаполнение:</strong> Фото, описание, цена — всё подгрузится автоматически
                            </p>
                        </div>
                    </GlassCard>
                </AnimateOnScroll>
            </div>
        </section>
    );
};