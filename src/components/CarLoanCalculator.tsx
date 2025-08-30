import React from "react";
import { useCarLoan } from "../hooks/useCarLoan";

interface Props {
  price: number;
  id: string;
}

const CarLoanCalculator: React.FC<Props> = ({ price, id }) => {
  const minPayment = Math.round(price * 0.1);
  const maxPayment = Math.round(price * 0.8);
  const {
    initialPayment,
    setInitialPayment,
    term,
    setTerm,
    loanAmount,
    monthlyPayment,
  } = useCarLoan(price, minPayment, maxPayment, id);

  return (
    <div className="mt-6 p-4 border rounded-xl shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-3">Купить в кредит</h2>
      <label className="block text-sm font-medium mb-1">
        Стоимость авто (₸)
      </label>
      <input
        value={price.toLocaleString()}
        readOnly
        className="w-full border rounded p-2 mb-2"
      />

      <label className="block text-sm font-medium mb-1">
        Первоначальный взнос (₸)
      </label>
      <input
        type="tel"
        value={initialPayment}
        onChange={(e) => setInitialPayment(Number(e.target.value))}
        className="w-full border rounded p-2 mb-2"
      />
      <p className="text-sm mb-3 text-gray-600">
        Минимум {minPayment.toLocaleString()} ₸
      </p>

      <label className="block text-sm font-medium mb-2">Срок (мес.)</label>
      <div className="flex justify-between gap-2 mb-3">
        {[12, 24, 36, 48, 60].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTerm(option)}
            className={`px-4 py-2 rounded-lg border transition w-full ${
              term === option
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="bg-gray-100 rounded-lg p-3">
        {initialPayment >= minPayment && initialPayment <= maxPayment ? (
          <>
            <p>
              <strong>Сумма кредита:</strong> {loanAmount.toLocaleString()} ₸
            </p>
            <p>
              <strong>Месячный платёж:</strong>{" "}
              {Number(monthlyPayment.toFixed(0)).toLocaleString()} ₸
            </p>
          </>
        ) : (
          <p className="text-red-500">
            Введите первоначальный взнос в диапазоне{" "}
            {minPayment.toLocaleString()} ₸ – {maxPayment.toLocaleString()} ₸
          </p>
        )}
      </div>
    </div>
  );
};

export default CarLoanCalculator;
