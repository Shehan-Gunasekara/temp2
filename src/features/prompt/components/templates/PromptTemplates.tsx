import React, { useState } from "react";
import { TemplateFilters } from "./TemplateFilters";
import { TemplateGrid } from "./TemplateGrid";
import { templates } from "../../data/templates";
import { Category } from "../../types";

interface Props {
  onSelect: (prompt: string) => void;
  selectedPrompt?: string;
}

export function PromptTemplates({ onSelect, selectedPrompt }: Props) {
  const templatesData = templates();
  const [category, setCategory] = useState<Category>("all");
  const filteredTemplates =
    category === "all"
      ? templatesData
      : templatesData.filter((t) => t.category === category);

  return (
    <div className="space-y-4">
      <TemplateFilters
        selectedCategory={category}
        onCategoryChange={setCategory}
      />
      <TemplateGrid
        templates={filteredTemplates}
        selectedPrompt={selectedPrompt}
        onSelect={onSelect}
      />
    </div>
  );
}
