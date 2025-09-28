import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { usePropertyForm } from "../hooks/usePropertyForm";
import { PropertyForm } from "../components/PropertyForm";
import { ImportModal } from "../components/ImportModal";

const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

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
  } = usePropertyForm(user, navigate);

  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Основная форма */}
        <PropertyForm
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
          onOpenImport={() => setShowImportModal(true)} // 🔹 сюда пробрасываем
        />
      </div>

      {/* Модалка импорта */}
      {showImportModal && (
        <ImportModal
          importUrl={formData.importUrl || ""}
          setImportUrl={(url) =>
            setFormData((p: typeof formData) => ({ ...p, importUrl: url }))
          }
          handleImport={(e) =>
            handleImport(e, {
              onSuccess: () => setShowImportModal(false), // ✅ закрываем модалку
            })
          }
          isImporting={importMutation.isPending}
          importError={importError}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default AddPropertyPage;
