// components/GlassCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAccentColor } from './AccentColorContext';
import { LIQUID_SPRING } from './utils';
import { type MotionProps } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    motionProps?: MotionProps; // Добавляем тип для motion-пропсов
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void; // Добавляем onClick в интерфейс
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', motionProps = {}, onClick }) => {
    const { accentColor } = useAccentColor();
    const hoverGlowStyle = {
        // Усиление тени с использованием акцентного цвета на hover
        boxShadow: `0 0 20px ${accentColor}1a, inset 0 0 10px rgba(255,255,255,0.05)`,
        scale: 1.02,
        transition: LIQUID_SPRING,
    };

    return (
        <motion.div
            style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                backdropFilter: 'blur(24px)', // backdrop-blur-3xl
                boxShadow: `0 4px 30px rgba(0,0,0,0.2), inset 0 0 15px rgba(255,255,255,0.05)`,
                border: `1px solid rgba(255,255,255,0.15)`,
            }}
            className={`p-6 md:p-8 rounded-3xl transition duration-300 ${className}`}
            whileHover={hoverGlowStyle}
            transition={LIQUID_SPRING}
            onClick={onClick} // Передаём onClick в motion.div
            {...motionProps}
        >
            {children}
        </motion.div>
    );
};