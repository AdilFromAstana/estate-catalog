import { useState, useMemo, useEffect } from "react";

export const useEstateLoan = (
  price: number,
  minPayment: number,
  maxPayment: number,
  id: string,
  baseRate = 14.5 // Базовая ставка для ипотеки в Казахстане
) => {
  const [initialPayment, setInitialPayment] = useState(minPayment);
  const [term, setTerm] = useState(240); // 20 лет в месяцах по умолчанию

  // Рассчитываем финальную ставку в зависимости от срока и первоначального взноса
  const calculateInterestRate = (
    termMonths: number,
    initialPct: number
  ): number => {
    let rate = baseRate;

    // Повышаем ставку для длинных сроков
    if (termMonths > 300) {
      // > 25 лет
      rate += 1.5;
    } else if (termMonths > 240) {
      // > 20 лет
      rate += 1.0;
    } else if (termMonths > 180) {
      // > 15 лет
      rate += 0.5;
    }

    // Понижаем ставку для большого первоначального взноса
    if (initialPct >= 50) {
      rate -= 1.0;
    } else if (initialPct >= 30) {
      rate -= 0.5;
    } else if (initialPct >= 20) {
      rate -= 0.25;
    }

    return Math.max(rate, 12.5); // Минимальная ставка 12.5%
  };

  // Сбрасываем параметры при смене объекта
  useEffect(() => {
    setInitialPayment(minPayment);
    setTerm(240); // 20 лет по умолчанию
  }, [id, minPayment]);

  const validInitialPayment = Math.min(
    Math.max(initialPayment, minPayment),
    maxPayment
  );

  const initialPaymentPercent = (validInitialPayment / price) * 100;
  const loanAmount = price - validInitialPayment;

  const interestRate = calculateInterestRate(term, initialPaymentPercent);
  const monthlyRate = interestRate / 100 / 12;

  const monthlyPayment = useMemo(() => {
    if (loanAmount <= 0) return 0;
    return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  }, [loanAmount, monthlyRate, term, id]);

  // Общая сумма выплат
  const totalPayment = useMemo(() => {
    return monthlyPayment * term;
  }, [monthlyPayment, term]);

  // Общая переплата
  const totalInterest = useMemo(() => {
    return totalPayment - loanAmount;
  }, [totalPayment, loanAmount]);

  return {
    initialPayment,
    setInitialPayment,
    term,
    setTerm,
    validInitialPayment,
    loanAmount,
    monthlyPayment,
    totalPayment,
    totalInterest,
    interestRate,
    minPayment,
    maxPayment,
    initialPaymentPercent,
  };
};
