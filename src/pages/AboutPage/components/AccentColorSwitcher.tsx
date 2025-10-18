// components/AccentColorSwitcher.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useAccentColor } from './AccentColorContext';
import { B_W_COLORS } from './utils';
import { LIQUID_SPRING } from './utils';
import { GlassCard } from './GlassCard';

/** Переключатель акцентного цвета */
export const AccentColorSwitcher: React.FC = () => {
    const { accentColor, setAccentColor, ACCENT_COLORS } = useAccentColor();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-colors`}
            >
                <Palette className={`w-6 h-6`} style={{ color: accentColor }} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={LIQUID_SPRING}
                        className={`absolute right-0 mt-2 p-3 rounded-xl shadow-2xl z-50`}
                    >
                        <GlassCard className="!p-3 border border-white/20">
                            <p className={B_W_COLORS.textSecondary + ' text-xs mb-2'}>Цвет свечения:</p>
                            <div className="flex space-x-2">
                                {ACCENT_COLORS.map(color => (
                                    <motion.button
                                        key={color.name}
                                        onClick={() => { setAccentColor(color.hex); setIsOpen(false); }}
                                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200`}
                                        style={{ backgroundColor: color.hex, borderColor: accentColor === color.hex ? 'white' : 'transparent' }}
                                        whileHover={{ scale: 1.1, boxShadow: `0 0 10px ${color.hex}` }}
                                    />
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};