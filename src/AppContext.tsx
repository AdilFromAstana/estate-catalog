// src/AppContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AppContextType } from "./types";
import { authApi } from "./api/authApi";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Инициализация: проверка авторизации при старте приложения
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = authApi.getCurrentUser();
        setUser(savedUser);
      } catch (error) {
        console.error("Ошибка инициализации авторизации:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // === Методы авторизации ===
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await authApi.login({ email, password });
      const currentUser = authApi.getCurrentUser();
      setUser(currentUser);
      return true;
    } catch (error) {
      console.error("Ошибка входа:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    agencyId: string
  ): Promise<boolean> => {
    try {
      await authApi.register({
        email,
        password,
        agencyId: Number(agencyId),
      });
      return true;
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      return false;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  // === Методы для работы с данными (временно оставим, но лучше перенести в компоненты) ===
  const addProperty = () =>
    // propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">
    {
      // В будущем: вызов propertyApi.create()
      // const newProperty: Property = {
      //   ...propertyData,
      //   id: Date.now().toString(),
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString(),
      // };
      // Но сейчас свойства не хранятся в контексте — удалим это позже
    };

  // const updateProperty = (id: string, updates: Partial<Property>) => {
  //   // В будущем: вызов propertyApi.update()
  // };

  // const deleteProperty = (id: string) => {
  //   // В будущем: вызов propertyApi.delete()
  // };

  const value: AppContextType = {
    user,
    properties: [], // ← временно пустой массив
    realtors: [], // ← временно пустой массив
    login,
    register,
    logout,
    addProperty,
    // updateProperty,
    // deleteProperty,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
