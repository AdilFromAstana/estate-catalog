import { Search } from 'lucide-react';

const Hero = () => {
    const showMessage = (msg: string) => alert(msg);

    return (
        <section className="pt-16 pb-20 sm:pt-24 sm:pb-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                    <div className="lg:col-span-6 text-center lg:text-left mb-10 lg:mb-0">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
                            Свой сайт недвижимости за 10 минут
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0">
                            Просто, красиво, удобно. Сервис №1 для риэлторов и агентств Казахстана.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <a
                                href="#pricing"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-8 rounded-xl text-lg font-semibold transition shadow-xl shadow-emerald-400/50 hover:scale-[1.05] active:scale-[0.95]"
                            >
                                Попробовать бесплатно
                            </a>
                            <button
                                onClick={() => showMessage('Демо-сайт загружается...')}
                                className="bg-white/70 backdrop-blur-sm border-2 border-gray-200 text-gray-700 py-3 px-8 rounded-xl text-lg font-semibold transition hover:bg-gray-50 hover:scale-[1.05] active:scale-[0.95]"
                            >
                                Посмотреть демо
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-gray-700 font-semibold bg-white/50 inline-block p-1 rounded-md backdrop-blur-sm">
                            5 дней пробный период. Не требуется привязка карты.
                        </p>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 transform -rotate-1 hover:rotate-0 transition duration-700">
                            <div className="bg-gradient-to-br from-blue-50 to-gray-200 rounded-xl h-64 sm:h-96 flex flex-col justify-between p-6 relative overflow-hidden">
                                <div className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-30">
                                    <svg viewBox="0 0 200 100" className="fill-current text-gray-400/50">
                                        <path d="M 0 100 L 20 80 L 40 90 L 60 70 L 80 85 L 100 65 L 120 75 L 140 60 L 160 70 L 180 55 L 200 65 V 100 Z" />
                                    </svg>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-gray-200 relative z-10">
                                    <div className="w-16 h-3 rounded bg-emerald-500 animate-pulse"></div>
                                    <div className="flex space-x-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-10 h-1.5 rounded bg-gray-300"></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center relative z-10">
                                    <div className="w-4/5 p-3 rounded-2xl bg-white shadow-xl border border-emerald-100 flex items-center space-x-3 hover:scale-[1.02] transition">
                                        <Search className="w-5 h-5 text-emerald-400" />
                                        <div className="w-2/5 h-2 rounded bg-gray-200"></div>
                                        <div className="w-1/3 h-2 rounded bg-gray-200"></div>
                                        <div className="w-1/4 h-3 rounded bg-emerald-500"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 relative z-10">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-lg p-2 shadow-md border border-gray-200 hover:-translate-y-0.5 transition">
                                            <div className="h-10 rounded bg-gray-300 mb-1"></div>
                                            <div className="h-2 rounded w-3/4 bg-gray-200"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;