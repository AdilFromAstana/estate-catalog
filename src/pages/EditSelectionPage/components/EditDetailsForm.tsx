import { Share2 } from "lucide-react";
import type { SelectionDetails } from "../EditSelectionPage";

interface EditDetailsFormProps {
    data: SelectionDetails;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EditDetailsForm: React.FC<EditDetailsFormProps> = ({ data, handleChange }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Метаданные подборки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

            {/* Поле Название */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Название подборки*</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={data.title}
                    onChange={handleChange}
                    required
                    placeholder="Например: Двушки до 50 млн в Астане"
                    className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 text-base focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>

            {/* Поле Описание */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Описание</label>
                <textarea
                    name="description"
                    id="description"
                    rows={1}
                    value={data.description}
                    onChange={handleChange}
                    placeholder="Краткое описание для себя или для публикации"
                    className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 text-base focus:ring-indigo-500 focus:border-indigo-500 resize-none transition"
                />
            </div>
        </div>

        {/* Чекбокс Публичность */}
        <div className="mt-6 pt-4 border-t border-gray-100">
            <label htmlFor="isPublic" className="flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={data.isPublic}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3"
                />
                <span className="text-base font-medium text-gray-700 flex items-center select-none">
                    Сделать общедоступной
                    <Share2 className="w-4 h-4 ml-2 text-indigo-500" />
                </span>
            </label>
        </div>
    </div>
);
export default EditDetailsForm