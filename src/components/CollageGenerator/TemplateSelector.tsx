import React from 'react';
import { collageTemplates } from './collageTemplates';

interface TemplateSelectorProps {
    selectedTemplate: string;
    onTemplateSelect: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    selectedTemplate,
    onTemplateSelect
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Выберите шаблон</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {collageTemplates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onTemplateSelect(template.id)}
                        className={`p-4 border-2 rounded-lg transition-all ${selectedTemplate === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="font-medium text-sm text-gray-900 mb-2">
                            {template.name}
                        </div>
                        <div className="bg-gray-100 rounded h-20 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                                {template.layout.length} фото
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;