import React from "react";
import { ImagePreview } from "./ImagePreview";
import type { City, District } from "../api/cityApi";
import { LabeledInput } from "./LabeledInput";
import { LabeledTextarea } from "./LabeledTextarea";
import { LabeledSelect } from "./LabeledSelect";
import { dictionaryLabels } from "../contants/dictionaryLabels";

interface Props {
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
}

export const PropertyEditForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  navigate,
  cities,
  districts,
  selectedCityId,
  setSelectedCityId,
  buildingTypes,
  conditions,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">Редактирование объекта</h2>

      {/* 🔹 Название и цена */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LabeledInput
          label="Заголовок"
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          required
        />
        <LabeledInput
          label="Цена"
          type="number"
          name="price"
          value={formData.price}
          onChange={onChange}
          required
        />
      </div>

      {/* 🔹 Локация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LabeledSelect
          label="Город"
          value={selectedCityId || ""}
          onChange={(e) => {
            const id = Number(e.target.value);
            setSelectedCityId(id);
          }}
          options={cities.map((c) => ({ value: c.id, label: c.name }))}
          required
        />
        <LabeledSelect
          label="Район"
          value={formData.districtId || ""}
          onChange={(e) =>
            onChange({
              target: { name: "districtId", value: Number(e.target.value) },
            } as any)
          }
          options={districts.map((d) => ({ value: d.id, label: d.name }))}
          required
        />
      </div>

      {/* 🔹 Основные параметры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LabeledInput
          type="number"
          name="area"
          value={formData.area}
          onChange={onChange}
          required
          label="Площадь (м²)"
        />
        <LabeledInput
          type="number"
          name="rooms"
          value={formData.rooms}
          onChange={onChange}
          required
          label="Комнаты"
        />
        <LabeledInput
          type="number"
          name="bathrooms"
          value={formData.bathrooms}
          onChange={onChange}
          required
          label="Ванные"
        />
      </div>

      {/* 🔹 Доп. характеристики */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LabeledInput
          type="number"
          name="floor"
          value={formData.floor}
          onChange={onChange}
          label="Этаж"
        />
        <LabeledInput
          type="number"
          name="totalFloors"
          value={formData.totalFloors}
          onChange={onChange}
          label="Всего этажей"
        />
        <LabeledSelect
          label="Тип здания"
          name="buildingType"
          value={formData.buildingType}
          onChange={onChange}
          required
          options={buildingTypes.map((b) => ({
            value: b,
            label: dictionaryLabels[b] || b,
          }))}
        />
        <LabeledSelect
          label="Состояние"
          name="condition"
          value={formData.condition}
          onChange={onChange}
          required
          options={conditions.map((c) => ({
            value: c,
            label: dictionaryLabels[c] || c,
          }))}
        />
      </div>

      {/* 🔹 Флаги */}
      <div className="flex gap-4 mt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isHot"
            checked={formData.isHot || false}
            onChange={(e) =>
              onChange({
                target: { name: "isHot", value: e.target.checked },
              } as any)
            }
          />
          🔥 Горячее
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isSold"
            checked={formData.isSold || false}
            onChange={(e) =>
              onChange({
                target: { name: "isSold", value: e.target.checked },
              } as any)
            }
          />
          ✅ Продано
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isMortgaged"
            checked={formData.isMortgaged || false}
            onChange={(e) =>
              onChange({
                target: { name: "isMortgaged", value: e.target.checked },
              } as any)
            }
          />
          ⚠️ В залоге
        </label>
      </div>

      {/* 🔹 Описание */}
      <LabeledTextarea
        name="description"
        value={formData.description}
        onChange={onChange}
        required
        rows={4}
        label="Описание"
      />

      {/* 🔹 Превью фото */}
      <ImagePreview images={formData.photos} />

      {/* 🔹 Кнопки */}
      <div className="flex justify-between mt-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Назад
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </form>
  );
};
