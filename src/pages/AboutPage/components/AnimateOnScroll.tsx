import React from 'react';
import { motion } from 'framer-motion';
import { LIQUID_SPRING } from './utils';

interface AnimateOnScrollProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    y?: number;
    scale?: number;
    className?: string;
}

/** Компонент для анимации появления при прокрутке (смягченный spring) */
export const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({ children, delay = 0, duration = 0.5, y = 50, scale = 1, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: y, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: scale }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...LIQUID_SPRING, duration: duration, delay: delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};