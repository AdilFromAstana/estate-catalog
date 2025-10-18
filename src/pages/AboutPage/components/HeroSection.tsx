// components/HeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { AnimateOnScroll } from './AnimateOnScroll';
import { GlassCard } from './GlassCard';
import { CTAButton } from './CTAButton';

interface HeroSectionProps {
    onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => {
    return (
        <section className="relative flex flex-col justify-center text-center overflow-hidden h-screen">
            <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                src="https://cdn.pixabay.com/video/2020/05/31/40705-426189554_large.mp4"
                style={{
                    filter: 'grayscale(100%) contrast(120%) brightness(80%) blur(0.5px)',
                }}
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-white">
                <AnimateOnScroll delay={0.2} y={30}>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight text-center">
                        Перестаньте переписываться с теми, кто{' '}
                        <motion.span
                            className="text-gray-300 block sm:inline"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            всё равно не купит
                        </motion.span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl font-light mb-6 sm:mb-8 text-gray-300 drop-shadow-lg text-center">
                        JUZ фильтрует нецелевых клиентов, чтобы вы тратили время только на реальные сделки.
                    </p>

                    {/* Кнопка CTA */}
                    <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-center sm:space-x-6">
                        <CTAButton onClick={onCtaClick} className="text-base sm:text-lg px-6 py-3">
                            Попробовать бесплатно
                        </CTAButton>
                        <p className="text-xs sm:text-sm text-gray-400 text-center">
                            Бесплатно 5 дней. Регистрация по SMS. Без карты.
                        </p>
                    </div>

                    {/* ДОБАВЛЕННЫЙ БЛОК - объяснение механизма */}
                    <AnimateOnScroll delay={0.5} y={20} className="mt-6 max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-300">
                            <div className="flex items-center space-x-2">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                                </motion.div>
                                <span>Клиенты проверяют ипотеку сами</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                >
                                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                                </motion.div>
                                <span>Вы получаете готовых к сделке</span>
                            </div>
                        </div>
                    </AnimateOnScroll>
                </AnimateOnScroll>

                {/* Мини-отзыв */}
                {/* <AnimateOnScroll delay={0.8} y={30} className="mt-8 sm:mt-12 md:mt-16 max-w-md mx-auto">
                    <GlassCard className="p-3 sm:p-4 flex items-center justify-center space-x-2 sm:space-x-3 text-left bg-white/10 backdrop-blur-md">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm italic text-gray-300">
                                «Я перестал отвечать на "просто спросить" — экономлю 10 часов в неделю.»
                                <span className="font-semibold text-white block pt-1">— Александр, Алматы</span>
                            </p>
                        </div>
                    </GlassCard>
                </AnimateOnScroll> */}
            </div>
        </section>
    );
};