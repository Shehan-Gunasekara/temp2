import React from "react";
import { Category } from "../../types";
import { getTranslation } from "../../../../utils/translations";
import { useLanguage } from "../../../auth/context/LanguageContext";

interface TemplateFiltersProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function TemplateFilters({
  selectedCategory,
  onCategoryChange,
}: TemplateFiltersProps) {
  const { language } = useLanguage();
  const categories: { value: Category; label: string }[] = [
    {
      value: "all",
      label: `${getTranslation(
        language,
        "ugc_actor.ugc_video.template_category.temp1"
      )}`,
    },
    {
      value: "lifestyle",
      label: `${getTranslation(
        language,
        "ugc_actor.ugc_video.template_category.temp2"
      )}`,
    },
    {
      value: "business",
      label: `${getTranslation(
        language,
        "ugc_actor.ugc_video.template_category.temp3"
      )}`,
    },
    {
      value: "professional",
      label: `${getTranslation(
        language,
        "ugc_actor.ugc_video.template_category.temp4"
      )}`,
    },
  ];
  return (
    <div className="flex items-center sm:space-x-2 space-x-1 pb-2 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category.value} // Added `key` prop for unique identification
          type="button" // Ensures button does not submit a form
          className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-[10px] sm:text-sm md:text-sm px-3 sm:px-4 py-2 sm:py-2 ${
            selectedCategory === category.value
              ? "bg-black text-white hover:bg-black/90"
              : "text-black/60 hover:text-black hover:bg-black/5"
          }`}
          onClick={() => onCategoryChange(category.value)}
          aria-pressed={selectedCategory === category.value} // Accessibility improvement
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
