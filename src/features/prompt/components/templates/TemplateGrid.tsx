import React from 'react';
import { TemplateCard } from './TemplateCard';
import { Template } from '../../types';

interface TemplateGridProps {
  templates: Template[];
  selectedPrompt?: string;
  onSelect: (prompt: string) => void;
}

export function TemplateGrid({ templates, selectedPrompt, onSelect }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isSelected={selectedPrompt === template.prompt}
          onClick={() => onSelect(template.prompt)}
        />
      ))}
    </div>
  );
}