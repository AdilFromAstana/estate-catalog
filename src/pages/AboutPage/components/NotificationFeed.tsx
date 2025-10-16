// components/NotificationFeedWithAnimation.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: number;
    icon: string;
    text: string;
    color: string;
}

const NotificationFeedWithAnimation: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const messages: Omit<Notification, 'id'>[] = [
        { icon: '✅', text: '+1 новый расчет ипотеки', color: '#4CAF50' },
        { icon: '❤️', text: '+2 добавили в избранное', color: '#E91E63' },
        { icon: '👁️', text: '+3 новых просмотра за час', color: '#2196F3' },
        { icon: '📞', text: 'Кто-то запросил контакты риэлтора', color: '#FF9800' },
        { icon: '🔄', text: 'Поделились объектом в WhatsApp', color: '#25D366' },
        { icon: '⭐', text: 'Объект добавлен в "Мои варианты"', color: '#FFC107' }
    ];

    const showRandomNotification = () => {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        const newNotification: Notification = {
            ...randomMsg,
            id: Date.now()
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Максимум 5 уведомлений

        setTimeout(() => {
            setNotifications(prev => prev.filter(notif => notif.id !== newNotification.id));
        }, 5000);
    };

    useEffect(() => {
        const interval = setInterval(showRandomNotification, 3000);
        const initialTimeout = setTimeout(showRandomNotification, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(initialTimeout);
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center space-x-3 bg-white rounded-lg shadow-lg border-l-4 px-4 py-3 min-w-64"
                        style={{ borderLeftColor: notification.color }}
                    >
                        <span className="text-lg">{notification.icon}</span>
                        <span className="text-sm font-medium text-gray-800 flex-1">
                            {notification.text}
                        </span>
                        <span className="text-xs text-gray-500">только что</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationFeedWithAnimation;