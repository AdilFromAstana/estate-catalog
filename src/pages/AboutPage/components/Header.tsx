import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="text-2xl font-extrabold text-gray-900 flex items-center">
                    <span className="text-emerald-500 mr-2 transition-transform hover:scale-105">JUZ</span> Real Estate
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-gray-700"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex md:space-x-8 absolute md:static top-16 left-0 w-full bg-white/90 md:bg-transparent py-4 md:py-0 z-40 md:z-auto`}>
                    {['Как это работает', 'Преимущества', 'Примеры', 'Тарифы'].map((item, idx) => (
                        <a
                            key={idx}
                            href={`#${item
                                .toLowerCase()
                                .replace(/\s+/g, '-')}`}
                            className="block px-4 py-2 hover:text-emerald-500 transition relative group"
                        >
                            {item}
                            <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </a>
                    ))}
                </nav>

                <a
                    href="#pricing"
                    className="hidden md:inline-block bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition shadow-md hover:scale-105"
                >
                    Попробовать
                </a>
            </div>
        </header>
    );
};

export default Header;