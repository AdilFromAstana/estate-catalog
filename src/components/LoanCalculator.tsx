import { type FC, useState } from "react";

const LoanCalculator: FC = () => {
  const [price, setPrice] = useState(0);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(15);

  const monthlyPayment =
    price && months ? ((price * (1 + rate / 100)) / months).toFixed(0) : 0;

  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold mb-3">Кредитный калькулятор</h3>

      <input
        type="number"
        placeholder="Стоимость авто"
        className="w-full p-2 border rounded-lg mb-2"
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Срок (мес)"
        className="w-full p-2 border rounded-lg mb-2"
        onChange={(e) => setMonths(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Ставка %"
        className="w-full p-2 border rounded-lg mb-2"
        onChange={(e) => setRate(Number(e.target.value))}
      />

      <p className="mt-3 text-lg">
        Ежемесячный платеж: <b>{monthlyPayment} ₸</b>
      </p>
    </div>
  );
};

export default LoanCalculator;
