// components/TrustBlock.tsx
import React from 'react';
import { Home, Briefcase, Users, Map } from 'lucide-react';
import { B_W_COLORS } from './utils';
import { AnimateOnScroll } from './AnimateOnScroll';
import { motion } from 'framer-motion';

// --- Trust Block ---
export const TrustBlock: React.FC = () => {
    const logos = [
        { name: 'HomeLux', icon: Home },
        { name: 'TopRealty', icon: Briefcase },
        { name: 'KzGroup', icon: Users },
        { name: 'CityPro', icon: Map },
    ];

    return (
        <section className={`py-12 ${B_W_COLORS.bgDarker} border-y border-white/10`}>
            <div className="max-w-7xl mx-auto px-4 text-center">
                <AnimateOnScroll y={20}>
                    <p className={`text-xl font-medium mb-6 ${B_W_COLORS.textSecondary}`}>
                        Нам доверяют более <span className='text-white font-bold'>120+ агентов</span> по всему Казахстану:
                    </p>
                </AnimateOnScroll>
                <div className="flex justify-around items-center flex-wrap gap-8 opacity-40">
                    {logos.map((logo, index) => (
                        <AnimateOnScroll key={index} delay={index * 0.15} y={20}>
                            <motion.div whileHover={{ scale: 1.1, opacity: 0.8 }}>
                                <logo.icon className="w-8 h-8 md:w-10 md:h-10 text-white mx-auto" />
                                <p className="text-xs mt-1 text-white">{logo.name}</p>
                            </motion.div>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};