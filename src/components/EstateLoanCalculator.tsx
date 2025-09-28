import React, { useState } from "react";
import {
  loanProgramsConfig,
  useEstateLoan,
  type LoanProgram,
} from "../hooks/useEstateLoan";
import { formatPrice } from "../api/propertyApi";

interface Props {
  price: number;
  id: number;
}

const programs: { value: LoanProgram; label: string; maxPrice?: number }[] = [
  { value: "7-20-25", label: "Госпрограмма «7-20-25»", maxPrice: 25000000 },
  { value: "orda", label: "«Орда Аймак»", maxPrice: 75000000 },
  { value: "commercial", label: "Коммерческая ипотека" }, // без лимита
  { value: "onay", label: "Цифровая ипотека Оңай", maxPrice: 175000000 }, // без лимита
];

const EstateLoanCalculator: React.FC<Props> = ({ price, id }) => {
  const [program, setProgram] = useState<LoanProgram>("commercial");
  const { minPercent, maxPercent } = loanProgramsConfig[program];

  const minPayment = Math.round(price * (minPercent / 100));
  const maxPayment = Math.round(price * (maxPercent / 100));

  const {
    initialPayment,
    setInitialPayment,
    term,
    setTerm,
    monthlyPayment,
    interestRate,
  } = useEstateLoan(price, id, program);

  const calculateLoanAmount = () => price - initialPayment;

  const isNotValid = minPayment > initialPayment || initialPayment > maxPayment;

  return (
    <div className="mt-6 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Ипотечный калькулятор
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Выберите программу
        </label>
        <select
          value={program}
          onChange={(e) => setProgram(e.target.value as LoanProgram)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          {programs
            .filter((p) => !p.maxPrice || price <= p.maxPrice)
            .map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
        </select>
      </div>

      {/* Ежемесячный платеж */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg flex flex-col items-center">
        <div className="text-sm text-gray-600 mb-1">Ежемесячный платеж</div>
        <div className="text-2xl font-bold text-blue-600">
          {!isNotValid
            ? `${Math.round(monthlyPayment).toLocaleString()} ₸`
            : "—"}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Ставка: {!isNotValid && interestRate}% годовых
        </div>
      </div>

      {/* Стоимость */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Стоимость недвижимости
        </label>
        <input
          value={formatPrice(price)}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
        />
      </div>

      {/* Первоначальный взнос */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Первоначальный взнос
          </label>
          <span className="text-sm text-gray-500">
            {!isNotValid && Math.round((initialPayment / price) * 100)}%
          </span>
        </div>

        <input
          type="range"
          min={minPayment}
          max={maxPayment}
          step={100000}
          value={initialPayment}
          onChange={(e) => setInitialPayment(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatPrice(minPayment)}</span>
          <span>{formatPrice(maxPayment)}</span>
        </div>

        <input
          type="tel"
          value={
            initialPayment ? Number(initialPayment).toLocaleString("ru-RU") : ""
          }
          onChange={(e) => {
            const raw = e.target.value.replace(/\s/g, "").replace(/,/g, "");
            if (/^\d*$/.test(raw)) setInitialPayment(Number(raw));
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 text-center font-medium"
        />
      </div>

      {/* Валидация */}
      {initialPayment < minPayment && (
        <div className="flex flex-col items-center text-red-600 text-sm">
          <p>Минимальный первоначальный взнос:</p>
          <p>
            {formatPrice(minPayment)} ({Math.round((minPayment / price) * 100)}
            %)
          </p>
        </div>
      )}
      {initialPayment > maxPayment && (
        <div className="flex flex-col items-center text-red-600 text-sm">
          <p>Максимальный первоначальный взнос:</p>
          <p>
            {formatPrice(maxPayment)} ({Math.round((maxPayment / price) * 100)}
            %)
          </p>
        </div>
      )}

      {/* Срок */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Срок кредита
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[5, 10, 15, 20, 25, 30].map((years) => (
            <button
              key={years}
              type="button"
              onClick={() => setTerm(years * 12)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                term === years * 12
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
              }`}
            >
              {years} лет
            </button>
          ))}
        </div>
      </div>

      {/* Итог */}
      <div className="border-t pt-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Сумма кредита:</span>
          <span className="font-medium">
            {!isNotValid ? formatPrice(calculateLoanAmount()) : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Первоначальный взнос:</span>
          <span className="font-medium">
            {!isNotValid ? formatPrice(initialPayment) : "—"}
          </span>
        </div>
        {/* <div className="flex justify-between">
          <span className="text-gray-600">Общая переплата:</span>
          <span className="font-medium">
            {!isNotValid
              ? formatPrice(monthlyPayment * term - calculateLoanAmount())
              : "—"}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default EstateLoanCalculator;
