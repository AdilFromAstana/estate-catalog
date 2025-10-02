import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { usePropertyForm } from "../hooks/usePropertyForm";
import { PropertyForm } from "../components/PropertyForm";
import { ImportModal } from "../components/ImportModal";
import toast from "react-hot-toast";

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

  // 👇 Закрываем модалку аккуратно после успешного импорта
  useEffect(() => {
    if (importMutation.isSuccess) {
      setShowImportModal(false);
      toast.success("Импорт успешен!");
    }
  }, [importMutation.isSuccess]);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
          onOpenImport={() => setShowImportModal(true)}
        />
      </div>

      {showImportModal && (
        <ImportModal
          importUrl={formData.importUrl || ""}
          setImportUrl={(url) =>
            setFormData((p: typeof formData) => ({ ...p, importUrl: url }))
          }
          handleImport={handleImport}
          isImporting={importMutation.isPending}
          importError={importError}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default AddPropertyPage;
