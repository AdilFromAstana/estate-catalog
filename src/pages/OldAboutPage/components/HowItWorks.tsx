import { Link, UploadCloud, Monitor } from 'lucide-react';

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20 sm:py-28 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Начать работу просто — всего 3 шага</h2>
                <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
                    Забудьте о рутине. JUZ автоматизирует создание вашего персонального сайта.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            icon: Link,
                            title: 'Вставьте ссылку с Krisha.kz',
                            desc: 'Просто укажите ссылку на ваш профиль или объявление.',
                            step: '1',
                        },
                        {
                            icon: UploadCloud,
                            title: 'Мы импортируем ваши объявления',
                            desc: 'Система автоматически перенесет все актуальные данные и фото.',
                            step: '2',
                        },
                        {
                            icon: Monitor,
                            title: 'Получите свой персональный сайт',
                            desc: 'Готовый, стильный сайт с фильтрами, поиском и личным доменом.',
                            step: '3',
                        },
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="flex flex-col items-center p-6 bg-white/70 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm transition duration-500 hover:shadow-2xl hover:scale-[1.01]"
                            >
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 mb-4 transform hover:rotate-3 transition duration-300">
                                    <Icon className="w-8 h-8 text-emerald-500" />
                                </div>
                                <p className="text-5xl font-extrabold text-emerald-500 mb-2">{item.step}</p>
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;