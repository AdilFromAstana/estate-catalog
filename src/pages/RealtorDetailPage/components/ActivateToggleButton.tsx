import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { ActivateToggleButtonProps } from "../../../types";

export const ActivateToggleButton: React.FC<ActivateToggleButtonProps> = ({
  isActive,
  onConfirm,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => setShowModal(true);

  const handleConfirm = () => {
    onConfirm(!isActive);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`font-medium py-2 px-4 rounded-lg shadow-md transition flex items-center ${
          isActive
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isActive ? "Деактивировать" : "Активировать"}
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-yellow-500 w-6 h-6 mr-2" />
              <h2 className="text-lg font-semibold">
                {isActive
                  ? "Деактивировать пользователя?"
                  : "Активировать пользователя?"}
              </h2>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              {isActive
                ? "Вы действительно хотите деактивировать этого пользователя? Он потеряет доступ к системе."
                : "Вы уверены, что хотите активировать этого пользователя и восстановить доступ?"}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-md text-white ${
                  isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isActive ? "Деактивировать" : "Активировать"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
