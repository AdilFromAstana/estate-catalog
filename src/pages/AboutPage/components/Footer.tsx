import { Mail, Shield, FileText } from 'lucide-react';

const Footer = () => {
    const showMessage = (msg: string) => alert(msg);

    return (
        <footer className="mt-20 py-12 bg-gray-900 text-white relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-xl font-bold text-white mb-2">
                            <span className="text-emerald-400">JUZ</span> Real Estate
                        </div>
                        <p className="text-gray-400 text-sm">
                            Современные IT-решения для рынка недвижимости Казахстана.
                        </p>
                    </div>

                    <div>
                        <h5 className="text-lg font-semibold mb-3 text-emerald-400">Разделы</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a href="#how-it-works" className="hover:text-white transition hover:underline">
                                    Как это работает
                                </a>
                            </li>
                            <li>
                                <a href="#advantages" className="hover:text-white transition hover:underline">
                                    Преимущества
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-lg font-semibold mb-3 text-emerald-400">Поддержка</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <button
                                    onClick={() => showMessage('Служба поддержки: support@juz-realestate.kz')}
                                    className="text-left hover:text-white transition hover:underline"
                                >
                                    Связаться с нами
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => showMessage('FAQ в разработке')}
                                    className="text-left hover:text-white transition hover:underline"
                                >
                                    FAQ
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-lg font-semibold mb-3 text-emerald-400">Документы</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <button
                                    onClick={() => showMessage('Политика конфиденциальности в разработке')}
                                    className="text-left hover:text-white transition hover:underline"
                                >
                                    Политика конфиденциальности
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => showMessage('Условия использования в разработке')}
                                    className="text-left hover:text-white transition hover:underline"
                                >
                                    Условия использования
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                    &copy; 2025 JUZ Real Estate. Все права защищены.
                </div>
            </div>
        </footer>
    );
};

export default Footer;