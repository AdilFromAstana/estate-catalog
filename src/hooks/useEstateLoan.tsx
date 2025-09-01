import { useEffect, useMemo, useState } from "react";

export type LoanProgram = "7-20-25" | "orda" | "commercial" | "onay";

type ProgramConfig = {
  minPercent: number;
  maxPercent: number;
  baseRate: number;
  calcRate: (term: number, initPct: number) => number;
};

export const loanProgramsConfig: Record<LoanProgram, ProgramConfig> = {
  "7-20-25": {
    minPercent: 20,
    maxPercent: 50,
    baseRate: 7,
    calcRate: () => 7,
  },
  orda: {
    minPercent: 10,
    maxPercent: 50,
    baseRate: 15.9,
    calcRate: () => 15.9,
  },
  commercial: {
    minPercent: 15,
    maxPercent: 80,
    baseRate: 14.5,
    calcRate: (term, initPct) => {
      let rate = 14.5;
      if (term > 300) rate += 1.5;
      else if (term > 240) rate += 1.0;
      else if (term > 180) rate += 0.5;

      if (initPct >= 50) rate -= 1.0;
      else if (initPct >= 30) rate -= 0.5;
      else if (initPct >= 20) rate -= 0.25;

      return Math.max(rate, 12.5);
    },
  },
  onay: {
    minPercent: 20,
    maxPercent: 80,
    baseRate: 15.9,
    calcRate: () => 15.9,
  },
};

export const useEstateLoan = (
  price: number,
  id: string,
  program: LoanProgram = "commercial"
) => {
  const config = loanProgramsConfig[program];

  const minPayment = Math.round(price * (config.minPercent / 100));
  const maxPayment = Math.round(price * (config.maxPercent / 100));

  const [initialPayment, setInitialPayment] = useState(minPayment);
  const [term, setTerm] = useState(240);

  useEffect(() => {
    setInitialPayment(minPayment);
    setTerm(240);
  }, [id, price, program, minPayment]);

  const validInitialPayment = Math.min(
    Math.max(initialPayment, minPayment),
    maxPayment
  );

  const initialPaymentPercent = (validInitialPayment / price) * 100;
  const loanAmount = price - validInitialPayment;

  const interestRate = config.calcRate(term, initialPaymentPercent);
  const monthlyRate = interestRate / 100 / 12;

  const monthlyPayment = useMemo(() => {
    if (loanAmount <= 0) return 0;
    return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  }, [loanAmount, monthlyRate, term]);

  const totalPayment = useMemo(
    () => monthlyPayment * term,
    [monthlyPayment, term]
  );

  const totalInterest = useMemo(
    () => totalPayment - loanAmount,
    [totalPayment, loanAmount]
  );

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
    program,
  };
};
