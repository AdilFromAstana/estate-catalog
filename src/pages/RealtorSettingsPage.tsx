// src/pages/RealtorSettingsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Upload, Save } from "lucide-react";
import toast from "react-hot-toast";
import { realtorApi } from "../api/realtorApi";

const RealtorSettingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [realtor, setRealtor] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  // Загрузка данных риелтора
  useEffect(() => {
    const fetchRealtor = async () => {
      if (!id) return;

      try {
        const data = await realtorApi.getById(id);
        setRealtor({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          avatar: data.avatar || "",
        });
      } catch (error: any) {
        console.error("Ошибка загрузки риелтора:", error);
        toast.error("Не удалось загрузить данные риелтора");
        navigate("/my-realtors");
      } finally {
        setLoading(false);
      }
    };

    fetchRealtor();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRealtor((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // В реальном проекте здесь будет загрузка файла на сервер
      const reader = new FileReader();
      reader.onload = (event) => {
        setRealtor((prev) => ({
          ...prev,
          avatar: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      await realtorApi.update(id, {
        name: realtor.name,
        email: realtor.email,
        phone: realtor.phone,
        avatar: realtor.avatar,
      });

      toast.success("Данные успешно обновлены!");
      navigate("/my-realtors");
    } catch (error: any) {
      console.error("Ошибка обновления:", error);
      const message =
        error.response?.data?.message || "Не удалось обновить данные";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          Назад к списку
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Настройки риелтора</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Аватар */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={realtor.avatar || "https://placehold.co/120?text=Аватар"}
                alt="Аватар"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                <Upload size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Поля формы */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Имя и фамилия *
              </label>
              <input
                type="text"
                name="name"
                value={realtor.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={realtor.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ivan@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-1" />
                Телефон
              </label>
              <input
                type="tel"
                name="phone"
                value={realtor.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+7 (701) 123-45-67"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {saving ? (
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
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealtorSettingsPage;
