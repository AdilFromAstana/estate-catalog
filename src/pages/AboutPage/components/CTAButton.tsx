// components/CTAButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAccentColor } from './AccentColorContext';
import { B_W_COLORS } from './utils';
import { LIQUID_SPRING } from './utils';

interface CTAButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean; // Добавляем disabled в интерфейс
}

export const CTAButton: React.FC<CTAButtonProps> = ({ children, className = '', onClick, type = 'button', disabled = false }) => { // Добавляем disabled в деструктуризацию и устанавливаем значение по умолчанию
    const { accentColor } = useAccentColor();
    const glowStyle = {
        // Акцентное свечение применяется через drop-shadow и hover-shadow
        filter: `drop-shadow(0 0 8px ${accentColor}90)`, // 90 is opacity ~56%
    };
    const hoverStyle = {
        scale: 1.02,
        boxShadow: `0 0 20px ${accentColor}90`,
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
            whileHover={!disabled ? hoverStyle : {}} // Отключаем hover-анимацию, если кнопка disabled
            transition={LIQUID_SPRING}
            className={`px-8 py-4 font-bold rounded-xl transition-all duration-300 ease-out 
                        ${B_W_COLORS.textPrimary} bg-white/10 
                        border border-white/50 
                        hover:bg-white hover:text-black hover:border-white 
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${className}`}
            style={glowStyle}
            disabled={disabled} // Передаём disabled в motion.button
        >
            {children}
        </motion.button>
    );
};