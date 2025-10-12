import React, { useState } from "react";
import { Save, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import InputField from "./InputField";

interface RealtorFormProps {
  realtor: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  updateRealtor: any; // react-query mutation
}

const RealtorForm: React.FC<RealtorFormProps> = ({
  realtor,
  isEditing,
  setIsEditing,
  updateRealtor,
}) => {
  const [formData, setFormData] = useState(realtor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (value?: string) => {
    setFormData((prev: any) => ({
      ...prev,
      phone: value || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRealtor.mutateAsync(formData);
      toast.success("Данные успешно обновлены!");
      setIsEditing(false);
    } catch {
      toast.error("Не удалось обновить данные");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Основные поля */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Фамилия *"
          name="lastName"
          value={formData.lastName || ""}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />
        <InputField
          label="Имя *"
          name="firstName"
          value={formData.firstName || ""}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />
        <InputField
          label="Отчество"
          name="middleName"
          value={formData.middleName || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <InputField
          label="Email *"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телефон
          </label>
          <PhoneInput
            international
            defaultCountry="KZ"
            countryCallingCodeEditable={false}
            value={formData.phone || undefined}
            onChange={handlePhoneChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              !isEditing
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "focus:ring-blue-500 border-gray-300"
            }`}
            inputClassName="w-full px-3 py-2 border-0 outline-none"
            countries={["KZ"]}
          />
        </div>
        <InputField
          label="Место работы (агентство)"
          name="agency"
          value={formData.agency?.name || ""}
          disabled
        />
        <InputField
          label="Instagram"
          name="instagram"
          value={formData.instagram || ""}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="@username"
        />
        <InputField
          label="TikTok"
          name="tiktok"
          value={formData.tiktok || ""}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="@username"
        />
      </div>

      {/* Чекбокс */}
      <div className="flex flex-wrap gap-6 pt-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isVerified"
            checked={formData.isVerified || false}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <span>Подтверждён</span>
        </label>
      </div>

      {/* Кнопки управления */}
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center pt-4 gap-3">
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex justify-center items-center"
          >
            <Edit3 size={16} className="mr-2" />
            Редактировать
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex justify-center items-center"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={updateRealtor.isPending}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
            >
              {updateRealtor.isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Сохранение...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Сохранить
                </>
              )}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default RealtorForm;
