// components/utils.ts
import { type SpringOptions } from 'framer-motion'; // Импортируем SpringOptions

// Строгая B&W палитра
export const B_W_COLORS = {
    bgPure: 'bg-black',
    bgDarker: 'bg-[#0a0a0a]',
    bgDarkest: 'bg-[#0d0d0d]', // Для чередования секций
    textPrimary: 'text-[#f9f9f9]',
    textSecondary: 'text-[#999999]',
};

// Конфигурация Framer Motion для "жидких" анимаций
export const LIQUID_SPRING: SpringOptions = {
    // type: 'spring', // Удаляем эту строку
    stiffness: 70,
    damping: 12
};