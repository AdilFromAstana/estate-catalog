import React, { useEffect, useRef } from 'react';
import type { UploadedImage } from '../../types/index';
import { collageTemplates } from './collageTemplates';

interface CollagePreviewProps {
    images: UploadedImage[];
    selectedTemplate: string;
    onCollageGenerated: (canvas: HTMLCanvasElement) => void;
}

const CollagePreview: React.FC<CollagePreviewProps> = ({
    images,
    selectedTemplate,
    onCollageGenerated
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Очистка canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Получение выбранного шаблона
        const template = collageTemplates.find(t => t.id === selectedTemplate);
        if (!template || images.length === 0) return;

        // Отрисовка фона
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Отрисовка изображений
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        const drawImages = async () => {
            const imageElements = await Promise.all(
                images.slice(0, template.layout.length).map(img => loadImage(img.url))
            );

            imageElements.forEach((img, index) => {
                const layout = template.layout[index];
                if (layout) {
                    ctx.drawImage(img, layout.x, layout.y, layout.width, layout.height);
                }
            });

            onCollageGenerated(canvas);
        };

        drawImages();
    }, [images, selectedTemplate, onCollageGenerated]);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Предпросмотр коллажа</h3>
            <div className="flex justify-center">
                <div className="border rounded-lg overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="max-w-full h-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default CollagePreview;