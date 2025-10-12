import {
  Building,
  FileText,
  Globe,
  Mail,
  Phone,
  Plus,
  Shield,
  User,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Сетка — на мобильных по 1 колонке, на планшетах 2, на десктопе 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-gray-800 pb-8">
          {/* Колонка 1 */}
          <div>
            <a href="/" className="flex-shrink-0 flex items-center mb-4">
              <span className="text-3xl font-extrabold text-indigo-400">
                JUZ
              </span>
              <span className="text-3xl font-light text-gray-200 ml-1">
                - Real Estate
              </span>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ведущая платформа для риелторов и агентств, оптимизирующая подбор
              и управление недвижимостью.
            </p>
          </div>

          {/* Колонка 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-400">
              Контакты
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-300 hover:text-indigo-300 transition-colors">
                <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                <a href="tel:+77000000000">+7 (700) 000-00-00</a>
              </li>
              <li className="flex items-center text-sm text-gray-300 hover:text-indigo-300 transition-colors">
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                <a href="mailto:support@juz.kz">support@juz.kz</a>
              </li>
              <li className="flex items-center text-sm text-gray-300 hover:text-indigo-300 transition-colors">
                <Globe className="w-4 h-4 mr-3 flex-shrink-0" />
                <a href="#">г. Астана, ул. Проспект Независимости, 1</a>
              </li>
            </ul>
          </div>

          {/* Колонка 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-400">
              Стать клиентом
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-300 hover:text-indigo-300 transition-colors"
                >
                  <User className="w-4 h-4 mr-3 flex-shrink-0" />
                  Найти недвижимость мечты
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-300 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-3 flex-shrink-0" />
                  Оставить заявку на подбор
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-300 hover:text-indigo-300 transition-colors"
                >
                  <Building className="w-4 h-4 mr-3 flex-shrink-0" />
                  Услуги для застройщиков
                </a>
              </li>
            </ul>
          </div>

          {/* Колонка 4 */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-400">
              Документы
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-300 hover:text-indigo-300 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
                  Публичный договор-оферта
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-sm text-gray-300 hover:text-indigo-300 transition-colors"
                >
                  <Shield className="w-4 h-4 mr-3 flex-shrink-0" />
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 text-center md:text-left">
          <p className="mb-3 md:mb-0">
            &copy; {new Date().getFullYear()} JUZ Real Estate. Все права
            защищены.
          </p>
          <p className="text-xs text-gray-600">
            Разработано с <span className="text-red-500">♥</span> командой
            DevStudio
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
