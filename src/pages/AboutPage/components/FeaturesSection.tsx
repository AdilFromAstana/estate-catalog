// components/FeaturesSection.tsx
import React from 'react';
import { Globe, Filter, Calculator, BarChart2, Briefcase, Smartphone } from 'lucide-react';
import { B_W_COLORS } from './utils';
import { AnimateOnScroll } from './AnimateOnScroll';
import { GlassCard } from './GlassCard';

// --- FeaturesSection ---
export const FeaturesSection: React.FC = () => {
    const features = [
        { icon: Globe, title: 'Глобальный поиск', desc: 'Автоматизированный поиск по всем крупным порталам.' },
        { icon: Filter, title: 'Умная фильтрация', desc: 'Отсев спама и нецелевых обращений в реальном времени.' },
        { icon: Calculator, title: 'Авторасчёт комиссии', desc: 'Мгновенный подсчёт потенциального дохода по сделке.' },
        { icon: BarChart2, title: 'Аналитика лидов', desc: 'Подробная статистика по эффективности ваших объявлений.' },
        { icon: Briefcase, title: 'CRM-интеграция', desc: 'Бесшовная синхронизация с вашей существующей CRM.' },
        { icon: Smartphone, title: 'Мобильный доступ', desc: 'Управляйте сделками с любого устройства.' },
    ];

    return (
        // Чередование фона: bgDarkest (#0d0d0d)
        <section className={`py-20 lg:py-28 ${B_W_COLORS.bgDarkest} ${B_W_COLORS.textPrimary}`}>
            <div className="max-w-7xl mx-auto px-4">
                <AnimateOnScroll y={30}>
                    <h2 className="text-4xl font-bold text-center mb-16">Основные возможности JUZ</h2>
                </AnimateOnScroll>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, index) => (
                        <AnimateOnScroll key={index} delay={index * 0.1} y={50}>
                            <GlassCard className="flex items-start space-x-4">
                                <div className="flex-shrink-0 p-3 rounded-full bg-white/20 border border-white/30">
                                    <f.icon className={`w-6 h-6 ${B_W_COLORS.textPrimary}`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">{f.title}</h3>
                                    <p className={B_W_COLORS.textSecondary}>{f.desc}</p>
                                </div>
                            </GlassCard>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};