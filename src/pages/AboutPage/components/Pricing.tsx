import { Check, Gift } from 'lucide-react';

const Pricing = () => {
    const showMessage = (msg: string) => alert(msg);

    return (
        <section id="pricing" className="py-20 sm:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Начните работать без конкуренции
                </h2>
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                    Выберите тариф и получите собственный брендированный сайт уже сегодня.
                </p>

                <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl border-4 border-emerald-500/80 transform hover:scale-[1.02] transition duration-500">
                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                        Стандартный тариф
                    </p>
                    <div className="flex items-end justify-center mb-6">
                        <span className="text-5xl font-extrabold text-gray-900">$20</span>
                        <span className="text-2xl font-medium text-gray-600 ml-2">/ месяц</span>
                    </div>

                    <ul className="text-left space-y-3 mb-8 text-gray-700">
                        <li className="flex items-center">
                            <Check className="w-5 h-5 text-emerald-500 mr-3" />
                            Персональный домен .juz-realestate.kz
                        </li>
                        <li className="flex items-center">
                            <Check className="w-5 h-5 text-emerald-500 mr-3" />
                            Неограниченное количество объявлений
                        </li>
                        <li className="flex items-center">
                            <Check className="w-5 h-5 text-emerald-500 mr-3" />
                            Автоимпорт с Krisha.kz
                        </li>
                        <li className="flex items-center font-bold text-emerald-600">
                            <Gift className="w-5 h-5 text-emerald-500 mr-3 animate-bounce" />
                            5 дней — бесплатно!
                        </li>
                    </ul>

                    <button
                        onClick={() => showMessage('Переход к регистрации. Мы ценим ваше желание развиваться!')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white w-full block py-4 px-8 rounded-xl text-xl font-bold transition duration-500 shadow-xl shadow-emerald-400/50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Создать мой сайт
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Pricing;