import React, { useState } from "react";
import { ImagePreview } from "./ImagePreview";
import { LabeledInput } from "./LabeledInput";
import { LabeledTextarea } from "./LabeledTextarea";
import { LabeledSelect } from "./LabeledSelect";
import { dictionaryLabels } from "../contants/dictionaryLabels";
import {
  PROPERTY_STATUS_COLORS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_OPTIONS,
} from "../contants/property-status";
import { Eye, EyeOff, Edit3, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import type { City, Complex, District, PropertyStatus } from "../types";

interface Props {
  setFormData: (v: any) => void;
  formData: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  navigate: (to: any) => void;
  cities: City[];
  districts: District[];
  selectedCityId: number;
  setSelectedCityId: (id: number) => void;
  buildingTypes: string[];
  conditions: string[];
  complexes: Complex[];
  updateMutation: any;
}

export const PropertyEditForm: React.FC<Props> = ({
  setFormData,
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  cities,
  districts,
  selectedCityId,
  setSelectedCityId,
  buildingTypes,
  conditions,
  updateMutation,
  navigate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayStatus, setDisplayStatus] = useState<PropertyStatus>(
    formData.status as PropertyStatus
  );

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
    setDisplayStatus(formData.status);
    setIsEditing(false);
  };

  // === Смена статуса с запросом ===
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PropertyStatus;

    setFormData((prev: any) => ({ ...prev, status: newStatus }));

    updateMutation.mutate(
      { status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Статус изменён на "${PROPERTY_STATUS_LABELS[newStatus]}"`
          );
          setDisplayStatus(newStatus);
        },
        onError: () => toast.error("Ошибка при изменении статуса"),
      }
    );
  };

  // === Смена публикации с запросом ===
  const handlePublishToggle = () => {
    const newValue = !formData.isPublished;
    setFormData((prev: any) => ({ ...prev, isPublished: newValue }));

    updateMutation.mutate(
      { isPublished: newValue },
      {
        onSuccess: () => {
          toast.success(`Объект ${newValue ? "опубликован" : "скрыт"}`);
        },
        onError: () => toast.error("Ошибка при обновлении публикации"),
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-6"
    >
      {/* 🔹 Верхняя панель управления */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b pb-5 mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition w-fit h-fit cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 leading-tight flex flex-wrap items-start gap-3 break-words">
              {formData.title || "Без названия"}
            </h2>
          </div>
          <Link
            to={formData.importUrl}
            target="_blank"
            className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition w-fit"
          >
            Ссылка на Крышу
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            ID: {formData.id} • Обновлено:{" "}
            {new Date(formData.updatedAt || Date.now()).toLocaleDateString(
              "ru-RU"
            )}
          </p>
          {displayStatus && (
            <div
              className={`w-fit block px-3 py-1 text-xs font-medium rounded-full bg-${PROPERTY_STATUS_COLORS[displayStatus]}-100 text-${PROPERTY_STATUS_COLORS[displayStatus]}-800 border border-${PROPERTY_STATUS_COLORS[displayStatus]}-200`}
            >
              {PROPERTY_STATUS_LABELS[displayStatus]}
            </div>
          )}
        </div>

        {/* Правая карточка */}
        <div className="mt-4 md:mt-0 bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3 w-full md:w-[260px] shadow-sm">
          {/* Статус */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-500 font-medium">Статус</label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleStatusChange} // ✅ теперь сразу обновляем
              className={`text-sm px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-${PROPERTY_STATUS_COLORS[formData.status as PropertyStatus]
                }-50 text-${PROPERTY_STATUS_COLORS[formData.status as PropertyStatus]
                }-800 font-medium cursor-pointer`}
            >
              {PROPERTY_STATUS_OPTIONS.map((o) => (
                <option
                  key={o.value}
                  value={o.value}
                  className={`text-${o.color}-700 bg-${o.color}-50`}
                >
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Публикация */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              Публикация
            </span>
            <button
              type="button"
              onClick={handlePublishToggle} // ✅ обновляем сразу
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium hover:opacity-90 cursor-pointer ${formData.isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
                }`}
            >
              {formData.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
              {formData.isPublished ? "Опубликован" : "Скрыт"}
            </button>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <label className="text-sm text-gray-500 font-medium block mb-1">
              Цена
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={onChange}
              disabled={!isEditing}
              className={`w-full text-lg font-semibold text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
            />
          </div>
        </div>
      </div>

      {/* 🔹 Локация и характеристики */}
      <fieldset disabled={!isEditing} className="space-y-6 opacity-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LabeledSelect
            disabled={!isEditing}
            label="Город"
            value={selectedCityId || ""}
            onChange={(e) => setSelectedCityId(Number(e.target.value))}
            options={cities.map((c) => ({ value: c.id, label: c.name }))}
            required
          />

          <LabeledSelect
            disabled={!isEditing}
            label="Район"
            value={formData.districtId || ""}
            onChange={(e) =>
              onChange({
                target: {
                  name: "districtId",
                  value: Number(e.target.value),
                },
              } as any)
            }
            options={districts.map((d) => ({ value: d.id, label: d.name }))}
            required
          />

          <LabeledInput
            disabled={!isEditing}
            type="text"
            name="address"
            label="Адрес"
            value={formData.address || ""}
            onChange={onChange}
          />
          <LabeledInput
            disabled={!isEditing}
            type="text"
            name="complex"
            label="ЖК"
            value={formData.complex || ""}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LabeledInput
            disabled={!isEditing}
            type="number"
            name="area"
            label="Площадь (м²)"
            value={formData.area || ""}
            onChange={onChange}
            required
          />
          <LabeledInput
            disabled={!isEditing}
            type="number"
            name="rooms"
            label="Комнат"
            value={formData.rooms || ""}
            onChange={onChange}
            required
          />
          <LabeledInput
            disabled={!isEditing}
            type="number"
            name="floor"
            label="Этаж"
            value={formData.floor || ""}
            onChange={onChange}
          />
          <LabeledInput
            disabled={!isEditing}
            type="number"
            name="totalFloors"
            label="Этажность"
            value={formData.totalFloors || ""}
            onChange={onChange}
          />
          <LabeledInput
            disabled={!isEditing}
            type="number"
            name="yearBuilt"
            label="Год постройки"
            value={formData.yearBuilt || ""}
            onChange={onChange}
          />
          <LabeledInput
            disabled={!isEditing}
            type="number"
            name="ceiling"
            label="Высота потолков (м)"
            value={formData.ceiling || ""}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LabeledSelect
            disabled={!isEditing}
            label="Тип здания"
            name="buildingTypeCode"
            value={formData.buildingTypeCode || ""}
            onChange={onChange}
            options={buildingTypes.map((b) => ({
              value: b,
              label: dictionaryLabels[b] || b,
            }))}
          />
          <LabeledSelect
            disabled={!isEditing}
            label="Состояние"
            name="flatRenovationCode"
            value={formData.flatRenovationCode || ""}
            onChange={onChange}
            options={conditions.map((c) => ({
              value: c,
              label: dictionaryLabels[c] || c,
            }))}
          />
        </div>

        <LabeledTextarea
          disabled={!isEditing}
          name="description"
          value={formData.description || ""}
          onChange={onChange}
          required
          rows={4}
          label="Описание"
        />
      </fieldset>

      <ImagePreview
        images={formData.photos}
        onChange={(newImgs) => setFormData({ ...formData, photos: newImgs })}
        allowEdit={isEditing}
      />

      {/* 🔹 Кнопки */}
      <div className="flex justify-between mt-6">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={toggleEdit}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <X size={16} /> Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={toggleEdit}
            className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit3 size={16} /> Редактировать
          </button>
        )}
      </div>
    </form>
  );
};
