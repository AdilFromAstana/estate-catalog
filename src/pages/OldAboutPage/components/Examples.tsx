import { Building, Home, Briefcase } from 'lucide-react';

const Examples = () => {
    const examples = [
        {
            name: 'Сайт агента Айман',
            domain: 'aiman.juz-realestate.kz',
            price: '28 000 000 ₸',
            desc: '3-комн. квартира, Астана, Есильский р-н',
            color: 'bg-emerald-100',
        },
        {
            name: 'Сайт агентства Алмаз',
            domain: 'almaz.juz-realestate.kz',
            price: '85 000 000 ₸',
            desc: 'Дом 240 м², Алматы, Медеуский р-н',
            color: 'bg-blue-100',
        },
        {
            name: 'Сайт агента Данияр',
            domain: 'daniyar.juz-realestate.kz',
            price: '350 000 ₸ / м²',
            desc: 'Офис 120 м², Шымкент, Аль-Фарабийский р-н',
            color: 'bg-yellow-100',
        },
    ];

    return (
        <section id="examples" className="py-20 sm:py-28 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Сайты наших успешных агентов</h2>
                <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
                    Посмотрите, как будут выглядеть ваши объявления в современном и чистом дизайне.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {examples.map((ex, idx) => (
                        <div
                            key={idx}
                            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition duration-500 hover:scale-[1.03]"
                        >
                            <div className="h-48 bg-gray-100 relative">
                                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500 font-medium">
                                    <div className="bg-white rounded-lg p-3 shadow-xl w-4/5 text-left transform translate-y-4">
                                        <div className={`${ex.color} h-20 rounded-lg mb-2`}></div>
                                        <p className="text-xs font-bold text-gray-900 mb-1">{ex.price}</p>
                                        <p className="text-xs text-gray-600">{ex.desc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">{ex.name}</h4>
                                <div className="text-sm text-emerald-600 font-mono bg-emerald-50 px-3 py-1 rounded-full inline-block transition duration-300 hover:bg-emerald-100">
                                    {ex.domain}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Examples;