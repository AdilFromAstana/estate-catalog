import { UserCheck, Edit, Smartphone, TrendingDown } from 'lucide-react';

const Advantages = () => {
    return (
        <section id="advantages" className="py-20 sm:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                    Почему JUZ — это выгодно?
                </h2>
                <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
                    Получите профессиональный инструмент, который работает на ваш бренд 24/7.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            icon: UserCheck,
                            title: 'Ваш личный сайт без конкурентов',
                            desc: 'Клиент видит только ваши объявления, никаких чужих предложений и отвлекающей рекламы.',
                        },
                        {
                            icon: Edit,
                            title: 'Простое управление объявлениями',
                            desc: 'Интуитивно понятный интерфейс в стиле Notion позволяет управлять каталогом в два клика.',
                        },
                        {
                            icon: Smartphone,
                            title: 'Работает на телефоне и компьютере',
                            desc: 'Адаптивный дизайн, который отлично выглядит на любом устройстве.',
                        },
                        {
                            icon: TrendingDown,
                            title: 'Дешевле, чем реклама на Krisha.kz',
                            desc: 'Фиксированная низкая цена, которая в долгосрочной перспективе сэкономит вам бюджет.',
                        },
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg flex flex-col items-start text-left transition duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500 mb-4">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Advantages;