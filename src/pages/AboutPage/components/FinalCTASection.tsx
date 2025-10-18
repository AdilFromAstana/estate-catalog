// components/FinalCTASection.tsx
import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import { CTAButton } from './CTAButton';
import { B_W_COLORS } from './utils';

interface FinalCTASectionProps {
    onCtaClick: () => void;
}

// --- FinalCTASection (Guarantee) ---
export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onCtaClick }) => {
    return (
        // Фон: вертикальный градиент from-black to-[#0a0a0a]
        <section className={`py-20 lg:py-32 bg-gradient-to-tr from-black to-[#0a0a0a] ${B_W_COLORS.textPrimary}`}>
            <div className="max-w-5xl mx-auto px-4 text-center">
                <AnimateOnScroll y={30} scale={1}>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Гарантия результата:
                    </h2>
                    <h3 className={`text-2xl md:text-3xl font-medium mb-10 ${B_W_COLORS.textSecondary}`}>
                        Если за 5 дней Вы не получите <span className='text-white'>хотя бы одну целевую заявку</span> —{' '}
                        <span className='font-bold' style={{ color: 'white' }}>мы вернём деньги.</span>
                    </h3>
                    <CTAButton onClick={onCtaClick} className="text-xl px-12 py-5">
                        Получить свой каталог сейчас
                    </CTAButton>
                </AnimateOnScroll>
            </div>
        </section>
    );
};