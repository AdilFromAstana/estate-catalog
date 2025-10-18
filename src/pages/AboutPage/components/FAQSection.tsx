// components/FAQSection.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { B_W_COLORS } from './utils';
import { AnimateOnScroll } from './AnimateOnScroll';
import { GlassCard } from './GlassCard';
import { useAccentColor } from './AccentColorContext';
import { LIQUID_SPRING } from './utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItemProps {
    title: string;
    content: string;
    index: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, index }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { accentColor } = useAccentColor();

    return (
        <AnimateOnScroll delay={index * 0.1} y={30}>
            <GlassCard
                className={`mb-4 cursor-pointer transition-all duration-300 ${isOpen ? 'border-white/40' : 'border-white/15'}`}
                motionProps={{ whileHover: { scale: 1.01 } }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex justify-between items-center text-xl font-semibold">
                    <h3>{title}</h3>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={LIQUID_SPRING}
                        style={{ color: accentColor }}
                    >
                        <ChevronDown className="w-6 h-6" />
                    </motion.div>
                </div>
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ ...LIQUID_SPRING, duration: 0.3 }}
                            className="overflow-hidden pt-4"
                        >
                            <p className={B_W_COLORS.textSecondary}>{content}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </AnimateOnScroll>
    );
};

// --- FAQSection (Accordion) ---
export const FAQSection: React.FC = () => {
    const faqs = [
        { title: 'Что будет после регистрации?', content: 'Вы получите полный доступ к демо-версии на 5 дней без необходимости ввода платёжных данных или карты.' },
        { title: 'Это действительно бесплатно?', content: 'Да, первые 5 дней использования платформы абсолютно бесплатны, после чего вы сможете выбрать подходящий тариф.' },
        { title: 'Нужно ли скачивать приложение?', content: 'Нет, JUZ RealEstate — это веб-приложение. Всё работает прямо в браузере, одинаково хорошо на компьютере и смартфоне.' },
        { title: 'Как JUZ фильтрует нецелевых клиентов?', content: 'Наша система использует продвинутые алгоритмы анализа диалогов и профилей для автоматического отсева спама, ботов и запросов "просто спросить".' },
    ];

    return (
        // Чередование фона: bgDarkest (#0d0d0d)
        <section className={`py-20 lg:py-28 ${B_W_COLORS.bgDarkest} ${B_W_COLORS.textPrimary}`}>
            <div className="max-w-4xl mx-auto px-4">
                <AnimateOnScroll y={30}>
                    <h2 className="text-4xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
                </AnimateOnScroll>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} {...faq} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};