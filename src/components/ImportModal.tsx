import React from "react";
import { Download, X } from "lucide-react";
import { useLinkPreview } from "../hooks/useProperties";

interface Props {
  importUrl: string;
  setImportUrl: (url: string) => void;
  handleImport: (e: React.FormEvent) => void;
  isImporting: boolean;
  importError: string | null;
  onClose: () => void;
}

export const ImportModal: React.FC<Props> = ({
  importUrl,
  setImportUrl,
  handleImport,
  isImporting,
  importError,
  onClose,
}) => {
  const { data: preview, isLoading } = useLinkPreview(importUrl);
  return (
    <>
      {/* 🔹 Серый фон */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose} // клик по фону тоже закрывает
      />

      {/* 🔹 Контент */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Импорт с Krisha.kz</h2>
            <button onClick={onClose}>
              <X size={20} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form onSubmit={handleImport} className="space-y-4">
            {isLoading && (
              <div className="mt-3 text-sm text-gray-500">
                Загружаем превью...
              </div>
            )}

            {preview && (
              <div className="mt-3 border rounded p-3 bg-gray-50 flex gap-3 flex-col">
                {preview.image && (
                  <img
                    src={preview.image}
                    alt="preview"
                    className="w-full object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-semibold">{preview.title}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {preview.description}
                  </p>
                </div>
              </div>
            )}

            <input
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              required
              placeholder="https://krisha.kz/a/show/..."
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={isImporting}
            />

            {importError && (
              <p className="text-red-500 text-sm">{importError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isImporting}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isImporting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {isImporting ? (
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
                    Импорт...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-1" /> Импортировать
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
