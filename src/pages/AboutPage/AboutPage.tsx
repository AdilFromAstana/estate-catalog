// AboutPage.tsx
import React, { useState } from 'react';
import { AccentColorProvider } from './components/AccentColorContext';
import { Header } from './components/Header';
import { TrustBlock } from './components/TrustBlock';
import { ProblemsSection } from './components/ProblemsSection';
import { JUZFilterDemoSection } from './components/JUZFilterDemoSection';
import { ClientInterfaceDemoSection } from './components/JUZSmartMatchSection';
import { HeroSection } from './components/HeroSection';
import { QuickImportSection } from './components/QuickImportSection';
import { FeaturesSection } from './components/FeaturesSection';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTASection } from './components/FinalCTASection';
import { MobileCTA } from './components/MobileCTA';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';

const AboutPageContent: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCtaClick = () => {
        setIsModalOpen(true);
    };

    return (
        <div className={`min-h-screen font-sans antialiased bg-gradient-to-b from-black to-[#0a0a0a]`}>
            <Header onCtaClick={handleCtaClick} />
            <main>
                {/* 1. ЭМОЦИОНАЛЬНЫЙ ЗАХВАТ */}
                <HeroSection onCtaClick={handleCtaClick} />

                {/* 2. ВЫЯВЛЕНИЕ БОЛИ */}
                <ProblemsSection />

                {/* 3. РЕШЕНИЕ (общее описание) */}
                <FeaturesSection />

                {/* 4. КАК ЭТО РАБОТАЕТ (демо) */}
                <QuickImportSection />
                <ClientInterfaceDemoSection /> {/* Переместить сюда! */}
                <JUZFilterDemoSection /> {/* Переместить сюда! */}

                {/* 5. ДОВЕРИЕ И ДОКАЗАТЕЛЬСТВА */}
                <TrustBlock />
                <TestimonialsSection />

                {/* 6. ЦЕННОСТЬ И ЦЕНА */}
                <PricingSection onCtaClick={handleCtaClick} />

                {/* 7. СНЯТИЕ ВОЗРАЖЕНИЙ */}
                <FAQSection />

                {/* 8. ПРИЗЫВ К ДЕЙСТВИЮ */}
                <FinalCTASection onCtaClick={handleCtaClick} />
            </main>
            <MobileCTA onCtaClick={handleCtaClick} />
            <Footer />
            {isModalOpen && <RegistrationModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const AboutPage: React.FC = () => {
    return (
        <AccentColorProvider>
            <AboutPageContent />
        </AccentColorProvider>
    );
};

export default AboutPage;