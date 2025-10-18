// components/ProblemsSection.tsx
import React from 'react';
import { MessageSquare, Map, Calculator, Clock } from 'lucide-react';
import { B_W_COLORS } from './utils';
import { AnimateOnScroll } from './AnimateOnScroll';
import { GlassCard } from './GlassCard';

// --- ProblemsSection ---
export const ProblemsSection: React.FC = () => {
    const problems = [
        { icon: MessageSquare, title: 'Спам в мессенджерах', desc: 'До 50% диалогов — нецелевые запросы и боты.' },
        { icon: Map, title: 'Неактуальные объекты', desc: 'Устаревшие объявления, которые уже проданы или сняты.' },
        { icon: Calculator, title: 'Ручной учёт расходов', desc: 'Сложно отслеживать бюджеты на рекламу и показы.' },
        { icon: Clock, title: 'Долгий ответ клиенту', desc: 'Потеря лидов из-за задержек в обработке заявок.' },
    ];

    return (
        // Чередование фона: bgDarker (#0a0a0a)
        <section className={`py-20 lg:py-28 ${B_W_COLORS.bgDarker} ${B_W_COLORS.textPrimary}`}>
            <div className="max-w-7xl mx-auto px-4">
                <AnimateOnScroll y={30}>
                    <h2 className="text-4xl font-bold text-center mb-16">Какие проблемы решает JUZ</h2>
                </AnimateOnScroll>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {problems.map((p, index) => (
                        <AnimateOnScroll key={index} delay={index * 0.1} y={50}>
                            <GlassCard className="text-center transition-all">
                                <p.icon className={`w-10 h-10 mx-auto mb-4 ${B_W_COLORS.textPrimary}`} />
                                <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                                <p className={B_W_COLORS.textSecondary}>{p.desc}</p>
                            </GlassCard>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};