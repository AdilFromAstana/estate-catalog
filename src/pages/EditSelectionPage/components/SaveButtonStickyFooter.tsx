import { Save } from "lucide-react";

interface SaveButtonStickyFooterProps {
    onSave: () => void;
    isDisabled: boolean;
    isSaving: boolean;
}

const SaveButtonStickyFooter: React.FC<SaveButtonStickyFooterProps> = ({ onSave, isDisabled, isSaving }) => (
    <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-100 p-4 shadow-2xl md:hidden z-20">
        <button
            onClick={onSave}
            disabled={isDisabled || isSaving}
            className={`
        w-full px-4 py-3 rounded-xl text-lg font-semibold transition duration-200 ease-in-out shadow-lg
        ${isDisabled || isSaving
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
        >
            <span className="flex items-center justify-center">
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </span>
        </button>
    </div>
);

export default SaveButtonStickyFooter