import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { CTAButton } from './CTAButton';
import { LIQUID_SPRING } from './utils';

interface MobileCTAProps {
    onCtaClick: () => void;
}

// --- Sticky Mobile CTA ---
export const MobileCTA: React.FC<MobileCTAProps> = ({ onCtaClick }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden z-40">
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ ...LIQUID_SPRING, delay: 0.5 }}
                className="p-3 bg-black/80 backdrop-blur-md border-t border-white/10"
            >
                <CTAButton onClick={onCtaClick} className="w-full text-base py-3 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Получить демо-доступ (бесплатно 5 дней)
                </CTAButton>
            </motion.div>
        </div>
    );
};