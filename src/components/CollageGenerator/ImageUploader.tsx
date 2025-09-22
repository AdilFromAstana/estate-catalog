import React, { useCallback } from 'react';
import { type UploadedImage } from '../../types/index';

interface ImageUploaderProps {
    onImagesUpload: (images: UploadedImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload }) => {
    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newImages: UploadedImage[] = Array.from(files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            url: URL.createObjectURL(file)
        }));

        onImagesUpload(newImages);
    }, [onImagesUpload]);

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Загрузите изображения</h3>
            <p className="text-sm text-gray-500 mb-4">Выберите несколько изображений для создания коллажа</p>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
            />
            <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
                Выбрать изображения
            </label>
        </div>
    );
};

export default ImageUploader;