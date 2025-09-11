import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Property, Realtor, AppContextType } from './types';
import { astanaEstates } from './contants/estates';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>({ id: "ag-123", email: "adilfirst@gmail.com", isAuthenticated: true, name: "Adil", role: "realtor" });
    const [properties, setProperties] = useState<Property[]>([]);
    const [realtors, setRealtors] = useState<Realtor[]>([]);
    const [loading, setLoading] = useState(true);

    // Загрузка начальных данных
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Загрузка риэлторов
                const realtorsData: Realtor[] = [
                    {
                        id: '1',
                        name: 'Иван Иванов',
                        email: 'ivan@example.com',
                        phone: '+7 (999) 123-45-67',
                        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                        experience: 5,
                        propertiesSold: 42,
                        rating: 4.8,
                        description: 'Специалист по элитной недвижимости в центре города. Помогу найти ваш идеальный дом.'
                    },
                    {
                        id: '2',
                        name: 'Мария Петрова',
                        email: 'maria@example.com',
                        phone: '+7 (999) 765-43-21',
                        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                        experience: 7,
                        propertiesSold: 67,
                        rating: 4.9,
                        description: 'Эксперт по загородной недвижимости. Знаю все лучшие предложения за городом.'
                    },
                    {
                        id: '3',
                        name: 'Алексей Смирнов',
                        email: 'alex@example.com',
                        phone: '+7 (999) 555-12-34',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                        experience: 3,
                        propertiesSold: 25,
                        rating: 4.6,
                        description: 'Молодой и амбициозный риэлтор. Специализируюсь на новостройках.'
                    }
                ];
                setRealtors(realtorsData);

                setProperties(astanaEstates);

                // Проверка авторизации
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Имитация запроса к API
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email && password) {
                    const userData: User = {
                        id: '1',
                        name: 'Текущий пользователь',
                        email: email,
                        role: 'realtor',
                        isAuthenticated: true,
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
                    };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 1000);
        });
    };

    const register = async (name: string, email: string, password: string, role: 'user' | 'realtor'): Promise<boolean> => {
        // Имитация регистрации
        return new Promise((resolve) => {
            setTimeout(() => {
                if (name && email && password) {
                    const userData: User = {
                        id: Date.now().toString(),
                        name: name,
                        email: email,
                        role: role,
                        isAuthenticated: true,
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
                    };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newProperty: Property = {
            ...propertyData,
            id: Date.now().toString(),
            createdAt: `${new Date()}`,
            updatedAt: `${new Date()}`
        };
        setProperties(prev => [...prev, newProperty]);
    };

    const updateProperty = (id: string, updates: Partial<Property>) => {
        setProperties(prev =>
            prev.map(prop =>
                prop.id === id ? { ...prop, ...updates, updatedAt: `${new Date()}` } : prop
            )
        );
    };

    const deleteProperty = (id: string) => {
        setProperties(prev => prev.filter(prop => prop.id !== id));
    };

    const value: AppContextType = {
        user,
        properties,
        realtors,
        login,
        register,
        logout,
        addProperty,
        updateProperty,
        deleteProperty,
        loading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};