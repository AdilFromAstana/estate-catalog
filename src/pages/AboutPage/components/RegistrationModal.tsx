// components/RegistrationModal.tsx
import React, { useState, useRef, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useAccentColor } from './AccentColorContext';
import { B_W_COLORS } from './utils';
import { LIQUID_SPRING } from './utils';
import { GlassCard } from './GlassCard';
import { CTAButton } from './CTAButton';

interface FormData {
    // phone теперь хранит только цифры
    phone: string;
    code: string;
    name: string;
}

interface RegistrationModalProps {
    onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose }) => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({ phone: '', code: '', name: '' });
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const { accentColor } = useAccentColor();

    // Ref для инпута телефона
    const phoneInputRef = useRef<HTMLInputElement>(null);

    // Функция для форматирования ввода телефона
    const formatPhone = (value: string): string => {
        const digits = value.replace(/\D/g, '').slice(0, 11);

        if (digits.length === 0) return '';

        // Удаляем первую цифру (7) если она есть, так как она уже в +7
        const bodyDigits = digits.startsWith('7') ? digits.substring(1) : digits;

        let i = 0; // Индекс в bodyDigits
        let result = '+7 (';

        // (XXX)
        for (; i < 3 && i < bodyDigits.length; i++) {
            result += bodyDigits[i];
        }

        if (i > 0) result += ') ';

        // XXX-
        for (; i < 6 && i < bodyDigits.length; i++) {
            result += bodyDigits[i];
        }

        if (i >= 6) result += '-';

        // XX-
        for (; i < 8 && i < bodyDigits.length; i++) {
            result += bodyDigits[i];
        }

        if (i >= 8) result += '-';

        // XX
        for (; i < 10 && i < bodyDigits.length; i++) {
            result += bodyDigits[i];
        }

        // Удаляем лишние символы в конце, если цифр недостаточно
        // Это упрощенная обрезка для чистоты конца.
        return result.trim().replace(/[-()]+$/, '');
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const inputElement = e.target;
            const previousValue = inputElement.value;
            const previousCaret = inputElement.selectionStart || 0;

            // 1. Получаем только цифры из текущего значения
            const digits = value.replace(/\D/g, '');
            const digitsLimited = digits.slice(0, 11);

            // 2. Вычисляем позицию курсора относительно цифр до форматирования
            let digitCountBeforeCaret = 0;
            for (let i = 0; i < previousCaret; i++) {
                if (/\d/.test(previousValue[i])) {
                    digitCountBeforeCaret++;
                }
            }
            // Это целевая позиция цифры в новом цифровом значении
            const targetDigitIndex = digitCountBeforeCaret;

            // 3. Обновляем состояние с новыми цифрами
            setFormData(prev => ({ ...prev, [name]: digitsLimited }));

            // 4. Форматируем новое значение
            const formattedValue = formatPhone(digitsLimited);

            // 5. Обновляем значение инпута напрямую
            inputElement.value = formattedValue;

            // 6. Рассчитываем и устанавливаем новую позицию курсора
            let newCaretPos = formattedValue.length; // По умолчанию в конец

            // Поиск позиции в отформатированной строке, соответствующей targetDigitIndex-ой цифре
            let foundDigits = 0;
            for (let i = 0; i < formattedValue.length; i++) {
                if (/\d/.test(formattedValue[i])) {
                    foundDigits++;
                }

                if (foundDigits === targetDigitIndex + 1) { // Курсор идет ПОСЛЕ цифры
                    newCaretPos = i + 1;
                    break;
                } else if (foundDigits === targetDigitIndex && i === formattedValue.length - 1) {
                    // Если курсор был в конце, и цифры все еще есть, ставим его в конец
                    newCaretPos = formattedValue.length;
                }
            }

            // Дополнительная логика для пропуска нецифровых символов после целевой цифры
            if (newCaretPos < formattedValue.length) {
                while (newCaretPos < formattedValue.length && !/\d/.test(formattedValue[newCaretPos])) {
                    newCaretPos++;
                }
            }

            inputElement.setSelectionRange(newCaretPos, newCaretPos);

        } else {
            // Остальные поля обновляются как обычно
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const nextStep = () => {
        // Извлекаем только цифры из строки телефона для проверки длины
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (step === 1 && phoneDigits.length === 11) setStep(2); // Проверяем длину 11 цифр
        else if (step === 2 && formData.code.length === 4) setStep(3);
        else if (step === 3 && formData.name.length > 2) {
            // Имитация успешной регистрации
            setIsSuccess(true);
            setTimeout(() => { onClose(); }, 3000);
        }
    };

    const renderStepContent = () => {
        if (isSuccess) {
            return (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
                    <Check className="w-16 h-16 mx-auto mb-4" color={accentColor} />
                    <h3 className="text-3xl font-bold">Добро пожаловать!</h3>
                    <p className={B_W_COLORS.textSecondary}>Демо-доступ активирован. Вы будете перенаправлены на сайт JUZ RealEstate.</p>
                </motion.div>
            );
        }

        switch (step) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={LIQUID_SPRING}>
                        <h4 className="text-xl font-semibold mb-4">Шаг 1: Ваш номер телефона</h4>
                        <input
                            type="tel"
                            name="phone"
                            ref={phoneInputRef} // Привязываем ref
                            // Отображаем отформатированное значение
                            value={formatPhone(formData.phone)}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-black/30 border border-white/20 text-white focus:ring-1`}
                            style={{ borderColor: accentColor + '40' }}
                        />
                        <p className={B_W_COLORS.textSecondary + ' text-sm mt-2'}>Для отправки кода активации.</p>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div key="step2" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={LIQUID_SPRING}>
                        <h4 className="text-xl font-semibold mb-4">Шаг 2: Введите код из SMS</h4>
                        <input
                            type="text"
                            name="code"
                            placeholder="****"
                            maxLength={4}
                            value={formData.code}
                            onChange={handleChange}
                            className={`w-full p-3 text-center text-2xl rounded-lg bg-black/30 border border-white/20 text-white focus:ring-1`}
                            style={{ borderColor: accentColor + '40' }}
                        />
                        <p className={B_W_COLORS.textSecondary + ' text-sm mt-2'}>Код отправлен на {formatPhone(formData.phone)}</p>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div key="step3" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={LIQUID_SPRING}>
                        <h4 className="text-xl font-semibold mb-4">Шаг 3: Ваше имя</h4>
                        <input
                            type="text"
                            name="name"
                            placeholder="Александр"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-black/30 border border-white/20 text-white focus:ring-1`}
                            style={{ borderColor: accentColor + '40' }}
                        />
                        <p className={B_W_COLORS.textSecondary + ' text-sm mt-2'}>Как к Вам обращаться?</p>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
            >
                <GlassCard
                    className="max-w-md w-full relative"
                    motionProps={{
                        initial: { scale: 0.9, y: -50 },
                        animate: { scale: 1, y: 0 },
                        exit: { scale: 0.8, opacity: 0 },
                        transition: LIQUID_SPRING
                    }}
                >
                    <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full ${B_W_COLORS.textPrimary} hover:bg-white/10`}>
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-3 text-white">
                        Получить Демо-доступ
                    </h2>
                    <div className="min-h-[150px] mb-6 text-white">
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>
                    </div>
                    <div className="flex justify-between items-center">
                        <button onClick={() => setStep(prev => Math.max(1, prev - 1))} className={B_W_COLORS.textSecondary + ' text-sm'}>
                            {step > 1 && !isSuccess ? '← Назад' : ''}
                        </button>
                        <CTAButton onClick={nextStep} disabled={isSuccess}>
                            {isSuccess ? 'Готово' : (step === 3 ? 'Завершить регистрацию' : 'Продолжить →')}
                        </CTAButton>
                    </div>
                    <p className={B_W_COLORS.textSecondary + ' text-xs text-center mt-4'}>
                        Бесплатно 5 дней. Без ввода карты.
                    </p>
                </GlassCard>
            </motion.div>
        </AnimatePresence>
    );
};