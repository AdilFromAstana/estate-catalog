// src/pages/RealtorSettingsPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Save, Key, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "../AppContext";
import { useRealtor, useUpdateRealtor } from "../hooks/useRealtor";

const InputField: React.FC<{
  label: string;
  name: string;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled,
  required,
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : "focus:ring-blue-500 border-gray-300"
      }`}
    />
  </div>
);

const RealtorSettingsPage: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const { data: realtor, isLoading } = useRealtor(user?.id || "");
  const updateRealtor = useUpdateRealtor(user?.id || "");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // когда включаем редактирование — копируем данные в форму
  const startEditing = () => {
    setFormData(realtor || {});
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev: any) => ({
          ...prev,
          avatar: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await updateRealtor.mutateAsync(formData);
      toast.success("Данные успешно обновлены!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error("Не удалось обновить данные");
      console.error(error);
    }
  };

  if (isLoading || !realtor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  const currentData = isEditing ? formData : realtor;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Аватар */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={
                  currentData.avatar || "https://placehold.co/120?text=Аватар"
                }
                alt="Аватар"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                  <Upload size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Фамилия *"
              name="lastName"
              value={currentData.lastName || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
            <InputField
              label="Имя *"
              name="firstName"
              value={currentData.firstName || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
            <InputField
              label="Отчество"
              name="middleName"
              value={currentData.middleName || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="Email *"
              name="email"
              type="email"
              value={currentData.email || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
            <InputField
              label="Телефон"
              name="phone"
              value={currentData.phone || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <InputField
              label="Место работы (агентство)"
              name="agency"
              value={currentData.agency?.name || ""}
              disabled
            />
            <InputField
              label="Instagram"
              name="instagram"
              value={currentData.instagram || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="@username"
            />
            <InputField
              label="TikTok"
              name="tiktok"
              value={currentData.tiktok || ""}
              onChange={handleInputChange}
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
                checked={currentData.isVerified || false}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <span>Подтверждён</span>
            </label>
          </div>

          {/* Кнопки */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => navigate("/change-password")}
              className="px-6 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-50 flex items-center cursor-pointer"
            >
              <Key size={16} className="mr-1" />
              Обновить пароль
            </button>

            <div className="flex space-x-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={startEditing}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center"
                >
                  <Edit3 size={16} className="mr-1" />
                  Редактировать
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={updateRealtor.isPending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center cursor-pointer"
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
                        <Save size={16} className="mr-1" />
                        Сохранить
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealtorSettingsPage;
