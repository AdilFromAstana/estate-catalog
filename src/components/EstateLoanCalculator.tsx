import React from "react";
import { useEstateLoan } from "../hooks/useEstateLoan";

interface Props {
  price: number;
  id: string;
}

const EstateLoanCalculator: React.FC<Props> = ({ price, id }) => {
  const minPayment = Math.round(price * 0.15); // 15% для недвижимости
  const maxPayment = Math.round(price * 0.8);

  const {
    initialPayment,
    setInitialPayment,
    term,
    setTerm,
    monthlyPayment,
    interestRate,
  } = useEstateLoan(price, minPayment, maxPayment, id);

  const formatPrice = (amount: number) => {
    return `${Number(amount.toFixed(0)).toLocaleString()} ₸`;
  };

  const calculateLoanAmount = () => price - initialPayment;

  return (
    <div className="mt-6 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Ипотечный калькулятор
      </h2>

      {/* Monthly Payment */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Ежемесячный платеж</div>
        <div className="text-2xl font-bold text-blue-600">
          {monthlyPayment > 0
            ? `${Math.round(monthlyPayment).toLocaleString()} ₸`
            : "—"}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Ставка: {interestRate}% годовых
        </div>
      </div>

      {/* Price Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Стоимость недвижимости
        </label>
        <div className="relative">
          <input
            value={formatPrice(price)}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
          />
        </div>
      </div>

      {/* Initial Payment */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Первоначальный взнос
          </label>
          <span className="text-sm text-gray-500">
            {Math.round((initialPayment / price) * 100)}%
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
          type="number"
          value={initialPayment}
          onChange={(e) => setInitialPayment(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 text-center font-medium"
        />
      </div>

      {/* Loan Term */}
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
              className={`px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
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

      {/* Loan Summary */}
      <div className="border-t pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Сумма кредита:</span>
            <span className="font-medium">
              {formatPrice(calculateLoanAmount())}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Первоначальный взнос:</span>
            <span className="font-medium">{formatPrice(initialPayment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Общая переплата:</span>
            <span className="font-medium">
              {monthlyPayment > 0
                ? formatPrice(monthlyPayment * term - calculateLoanAmount())
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {initialPayment < minPayment && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            Минимальный первоначальный взнос: {formatPrice(minPayment)} (
            {Math.round((minPayment / price) * 100)}%)
          </p>
        </div>
      )}

      {/* <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
        }
      `}</style> */}
    </div>
  );
};

export default EstateLoanCalculator;
