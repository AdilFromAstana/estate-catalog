import React from "react";
import { Download } from "lucide-react";

interface Props {
  importUrl: string;
  setImportUrl: (val: string) => void;
  handleImport: (e: React.FormEvent) => void;
  isImporting: boolean; // остаётся boolean
  importError: string | null;
  parsedData: any;
  onReset: () => void;
}

export const ImportForm: React.FC<Props> = ({
  importUrl,
  setImportUrl,
  handleImport,
  isImporting,
  importError,
  parsedData,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Импорт данных с Krisha.kz</h2>
      <form onSubmit={handleImport} className="space-y-4">
        <input
          type="url"
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          required
          placeholder="https://krisha.kz/a/show/..."
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={isImporting}
        />
        {importError && <p className="text-red-500 text-sm">{importError}</p>}
        {parsedData && (
          <div className="text-green-600 text-sm">
            Данные успешно импортированы!
            <button
              type="button"
              onClick={onReset}
              className="ml-2 text-blue-500"
            >
              Сбросить импорт
            </button>
          </div>
        )}
        <button
          type="submit"
          disabled={isImporting}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {isImporting ? (
            "Импорт..."
          ) : (
            <>
              <Download size={16} className="mr-1" /> Импортировать
            </>
          )}
        </button>
      </form>
    </div>
  );
};
