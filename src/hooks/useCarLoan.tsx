import { useState, useMemo } from "react";

export const useCarLoan = (
  price: number,
  minPayment: number,
  maxPayment: number,
  rate = 15
) => {
  const [initialPayment, setInitialPayment] = useState(minPayment);
  const [term, setTerm] = useState(36); // мес

  const validInitialPayment = Math.min(
    Math.max(initialPayment, minPayment),
    maxPayment
  );
  const loanAmount = price - validInitialPayment;
  const monthlyRate = rate / 100 / 12;

  const monthlyPayment = useMemo(() => {
    return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  }, [loanAmount, monthlyRate, term]);

  return {
    initialPayment,
    setInitialPayment,
    term,
    setTerm,
    validInitialPayment,
    loanAmount,
    monthlyPayment,
    minPayment,
    maxPayment,
  };
};
