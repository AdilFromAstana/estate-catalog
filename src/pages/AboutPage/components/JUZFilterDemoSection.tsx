// components/JUZFilterDemoSection.tsx
import React from 'react';
import { User, Calculator, Check } from 'lucide-react';
import { B_W_COLORS } from './utils';
import { AnimateOnScroll } from './AnimateOnScroll';
import { GlassCard } from './GlassCard';
import { useAccentColor } from './AccentColorContext';

// --- NEW: "JUZFilterDemoSection" (как отсекаются лишние) ---
export const JUZFilterDemoSection: React.FC = () => {
    const { accentColor } = useAccentColor();

    return (
        <section className={`py-20 lg:py-28 ${B_W_COLORS.bgPure} ${B_W_COLORS.textPrimary}`}>
            <div className="max-w-6xl mx-auto px-4 text-center">
                <AnimateOnScroll y={30}>
                    <h2 className="text-4xl font-bold mb-6">Как JUZ оставляет только реальных покупателей</h2>
                    <p className={`text-lg mb-12 ${B_W_COLORS.textSecondary}`}>
                        Каждый клиент на JUZ проходит путь проверки: от выбора квартиры до подтверждения бюджета и ипотеки.
                    </p>
                </AnimateOnScroll>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnimateOnScroll delay={0.1}>
                        <GlassCard className="relative overflow-hidden">
                            <User className="w-10 h-10 mx-auto mb-4" color={accentColor} />
                            <h3 className="text-xl font-semibold mb-2">Шаг 1. Клиент выбирает</h3>
                            <p className={B_W_COLORS.textSecondary}>
                                Пользователь сортирует квартиры, выбирает понравившиеся варианты и указывает свой бюджет.
                            </p>
                        </GlassCard>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={0.3}>
                        <GlassCard className="relative overflow-hidden">
                            <Calculator className="w-10 h-10 mx-auto mb-4" color={accentColor} />
                            <h3 className="text-xl font-semibold mb-2">Шаг 2. Вводит финансы</h3>
                            <p className={B_W_COLORS.textSecondary}>
                                Указывает, сколько у него есть первоначалки и какая зарплата.
                                JUZ показывает, какие ипотеки доступны именно ему.
                            </p>
                        </GlassCard>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={0.5}>
                        <GlassCard className="relative overflow-hidden">
                            <Check className="w-10 h-10 mx-auto mb-4" color={accentColor} />
                            <h3 className="text-xl font-semibold mb-2">Шаг 3. Готов к сделке</h3>
                            <p className={B_W_COLORS.textSecondary}>
                                После подбора клиент сразу получает отчёт и запись на просмотр.
                                На этом этапе остаются только реальные покупатели.
                            </p>
                        </GlassCard>
                    </AnimateOnScroll>
                </div>
            </div>
        </section>
    );
};