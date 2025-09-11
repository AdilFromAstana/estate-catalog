import React from 'react';
import { useApp } from '../AppContext';
import { Phone, Mail, Star, Calendar, Home, Award } from 'lucide-react';

const RealtorsPage: React.FC = () => {
    const { realtors } = useApp();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Наши риэлторы</h1>
                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    Профессиональные агенты по недвижимости с многолетним опытом работы.
                    Каждый специалист поможет вам найти идеальный вариант.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {realtors.map(realtor => (
                        <div key={realtor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                                <img
                                    src={realtor.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face'}
                                    alt={realtor.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Топ риэлтор
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{realtor.name}</h3>
                                <p className="text-gray-600 mb-4">{realtor.description}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-600">
                                        <Star className="h-5 w-5 text-yellow-400 mr-2" />
                                        <span>Рейтинг: {realtor.rating}/5</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                                        <span>Опыт: {realtor.experience} лет</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Home className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Продано: {realtor.propertiesSold} объектов</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Award className="h-5 w-5 text-purple-500 mr-2" />
                                        <span>Специализация: {realtor.experience > 5 ? 'Элитная недвижимость' : 'Новостройки'}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center text-gray-600">
                                            <Phone className="h-5 w-5 mr-2" />
                                            <span className="text-sm">{realtor.phone}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="h-5 w-5 mr-2" />
                                        <span className="text-sm">{realtor.email}</span>
                                    </div>
                                </div>

                                <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                                    Связаться с риэлтором
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Станьте частью нашей команды</h2>
                    <p className="text-gray-600 mb-6">
                        Присоединяйтесь к лучшим риэлторам страны и начните успешную карьеру в недвижимости
                    </p>
                    <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
                        Стать риэлтором
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RealtorsPage;