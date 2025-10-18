// components/Header.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { B_W_COLORS } from './utils';
import { LIQUID_SPRING } from './utils';
import { CTAButton } from './CTAButton';
import { AccentColorSwitcher } from './AccentColorSwitcher';

interface HeaderProps {
    onCtaClick: () => void;
}

// --- Header ---
export const Header: React.FC<HeaderProps> = ({ onCtaClick }) => {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={LIQUID_SPRING}
            className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/40 backdrop-blur-3xl border-b border-white/10 shadow-lg"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <motion.h1
                    className={`text-2xl font-extrabold ${B_W_COLORS.textPrimary} filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]`}
                    whileHover={{ scale: 1.05 }}
                >
                    JUZ.kz <span className={`${B_W_COLORS.textSecondary} font-light`}>RealEstate</span>
                </motion.h1>
                <div className="hidden sm:block">
                    <CTAButton onClick={onCtaClick} className="py-2 px-6">
                        Начать бесплатно
                    </CTAButton>
                </div>
                <AccentColorSwitcher />
            </div>
        </motion.header>
    );
};