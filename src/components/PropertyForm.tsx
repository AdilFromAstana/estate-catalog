import React from "react";
import { ImagePreview } from "./ImagePreview";
import type { City, District } from "../api/cityApi";
import { LabeledInput } from "./LabeledInput";
import { LabeledTextarea } from "./LabeledTextarea";
import { LabeledSelect } from "./LabeledSelect";
import { dictionaryLabels } from "../contants/dictionaryLabels";
import type { Complex } from "../api/complexApi";

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
  complexes: Complex[];
}

export const PropertyForm: React.FC<Props> = ({
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
  complexes,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">Данные объекта</h2>
      </div>

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

        <LabeledInput
          type="text"
          name="street"
          value={formData.street}
          onChange={onChange}
          label="Улица"
          className="px-3 py-2 border rounded-md"
        />
        <LabeledInput
          type="text"
          name="houseNumber"
          value={formData.houseNumber}
          onChange={onChange}
          label="Номер дома"
          className="px-3 py-2 border rounded-md"
        />
      </div>

      {/* 🔹 Площадь, комнаты, санузлы */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LabeledInput
          type="number"
          name="area"
          value={formData.area}
          onChange={onChange}
          required
          label="Площадь (м²)"
          min={0}
          step={0.1}
        />
        <LabeledInput
          type="number"
          name="rooms"
          value={formData.rooms}
          onChange={onChange}
          required
          label="Комнаты"
          className="px-3 py-2 border rounded-md"
        />
        <LabeledInput
          type="number"
          name="bathrooms"
          value={formData.bathrooms}
          onChange={onChange}
          required
          label="Ванные"
          className="px-3 py-2 border rounded-md"
        />
      </div>

      {/* 🔹 Дополнительные поля */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LabeledInput
          type="number"
          name="floor"
          value={formData.floor}
          onChange={onChange}
          label="Этаж"
          className="px-3 py-2 border rounded-md"
        />
        <LabeledInput
          type="number"
          name="totalFloors"
          value={formData.totalFloors}
          onChange={onChange}
          label="Всего этажей"
          className="px-3 py-2 border rounded-md"
        />
        <LabeledSelect
          label="Тип здания"
          name="buildingType"
          value={formData.buildingType}
          onChange={onChange}
          required
          options={buildingTypes.map((b) => ({
            value: b, // ← это уйдёт в API
            label: dictionaryLabels[b] || b, // ← это увидит пользователь
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

        <LabeledInput
          type="number"
          name="kitchenArea"
          value={formData.kitchenArea}
          onChange={onChange}
          label="Площадь кухни"
          className="px-3 py-2 border rounded-md"
        />
        <LabeledInput
          type="number"
          name="yearBuilt"
          value={formData.yearBuilt}
          onChange={onChange}
          label="Год постройки"
          required
          min={1800}
        />
        <LabeledInput
          type="text"
          name="balcony"
          value={formData.balcony}
          onChange={onChange}
          label="Балкон"
          className="px-3 py-2 border rounded-md"
        />
        <LabeledInput
          type="text"
          name="parking"
          value={formData.parking}
          onChange={onChange}
          label="Парковка"
          className="px-3 py-2 border rounded-md"
        />
        <LabeledInput
          type="text"
          name="furniture"
          value={formData.furniture}
          onChange={onChange}
          label="Мебель"
          className="px-3 py-2 border rounded-md"
        />
        <LabeledSelect
          label="Жилой комплекс"
          name="complexId"
          value={formData.complexId || ""}
          onChange={(e) =>
            onChange({
              target: { name: "complexId", value: Number(e.target.value) },
            } as any)
          }
          options={complexes.map((c) => ({ value: c.id, label: c.name }))}
          required
        />
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

      {/* 🔹 Превью картинок */}
      <ImagePreview images={formData.photos} />

      {/* 🔹 Кнопки */}
      <div className="flex justify-between mt-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? "Добавление..." : "Добавить объект"}
          </button>
        </div>
      </div>
    </form>
  );
};
