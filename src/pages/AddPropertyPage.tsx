import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AppContext";
import { usePropertyForm } from "../hooks/usePropertyForm";
import { PropertyForm } from "../components/PropertyForm";
import toast from "react-hot-toast";
import { Download } from "lucide-react";

const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"manual" | "import">("manual");

  const {
    formData,
    setFormData,
    selectedCityId,
    setSelectedCityId,
    importError,
    handleImport,
    handleSubmit,
    handleInputChange,
    isSubmitting,
    importMutation,
    cities,
    districts,
    buildingTypes,
    conditions,
    complexes,
  } = usePropertyForm(user, navigate);

  // 🔹 После успешного импорта — редирект на страницу редактирования
  useEffect(() => {
    if (importMutation.isSuccess && importMutation.data?.id) {
      toast.success("Импорт успешен!");
      navigate(`/edit-property/${importMutation.data.id}`);
    }
  }, [importMutation.isSuccess, importMutation.data, navigate]);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 🔹 Табы */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "manual"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Добавить вручную
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "import"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Импорт с Krisha.kz
          </button>
        </div>

        {/* 🔹 Контент табов */}
        {activeTab === "manual" ? (
          <PropertyForm
            complexes={complexes}
            buildingTypes={buildingTypes}
            conditions={conditions}
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            navigate={navigate}
            cities={cities}
            districts={districts}
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              Импортировать с Krisha.kz
            </h2>

            <form
              onSubmit={handleImport}
              className="flex flex-col gap-4 w-full"
            >
              <label className="text-sm font-medium text-gray-700">
                Ссылка на объявление:
              </label>

              <input
                type="url"
                value={formData.importUrl || ""}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    importUrl: e.target.value,
                  }))
                }
                required
                placeholder="https://krisha.kz/a/show/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={importMutation.isPending}
              />

              {importError && (
                <p className="text-red-500 text-sm">{importError}</p>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="submit"
                  disabled={importMutation.isPending}
                  className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50"
                >
                  {importMutation.isPending ? (
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
                      Импортируем...
                    </>
                  ) : (
                    <>
                      <Download size={16} className="mr-2" />
                      Импортировать
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Если бек возвращает превью */}
            {/* {importMutation.data?.preview && (
              <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                <img
                  src={importMutation.data.preview.image}
                  alt="preview"
                  className="w-full object-cover rounded-md mb-2"
                />
                <p className="font-semibold text-gray-900">
                  {importMutation.data.preview.title}
                </p>
                <p className="text-gray-600 text-sm">
                  {importMutation.data.preview.description}
                </p>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPropertyPage;
