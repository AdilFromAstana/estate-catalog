// components/AccentColorContext.tsx
import React, { useState, useContext, createContext, useMemo, type ReactNode } from 'react';

interface AccentColorOption {
    name: string;
    hex: string;
}

export const ACCENT_COLORS: AccentColorOption[] = [
    { name: 'White', hex: '#ffffff' }, // Default (B&W Glow)
    { name: 'Cyan', hex: '#00ffff' },
    { name: 'Lime', hex: '#00ff00' },
    { name: 'Violet', hex: '#ff00ff' },
];

interface AccentColorContextType {
    accentColor: string;
    setAccentColor: React.Dispatch<React.SetStateAction<string>>;
    ACCENT_COLORS: AccentColorOption[];
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

export const AccentColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accentColor, setAccentColor] = useState<string>(ACCENT_COLORS[0].hex);
    const value = useMemo(() => ({
        accentColor,
        setAccentColor,
        ACCENT_COLORS
    }), [accentColor]);

    return (
        <AccentColorContext.Provider value={value}>
            {children}
        </AccentColorContext.Provider>
    );
};

export const useAccentColor = (): AccentColorContextType => {
    const context = useContext(AccentColorContext);
    if (!context) {
        throw new Error('useAccentColor must be used within an AccentColorProvider');
    }
    return context;
};