// components/Footer.tsx
import React from 'react';
import { B_W_COLORS } from './utils';

// --- Footer ---
export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const appId = 'JUZ_RE_DEFAULT_ID';
    const authToken = 'AUTH_TOKEN_MISSING';

    return (
        <footer className={`py-10 ${B_W_COLORS.textPrimary} ${B_W_COLORS.bgPure} border-t border-white/10`}>
            <div className="max-w-7xl mx-auto px-4 text-center text-sm">
                <p className={`mb-1 ${B_W_COLORS.textSecondary}`}>
                    © {currentYear} JUZ RealEstate. Все права защищены.
                </p>
                <p className={`text-gray-600 text-xs`}>
                    AppID: {appId} | Token: {authToken}
                </p>
            </div>
        </footer>
    );
};