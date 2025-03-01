import React from "react";
import { Play } from "lucide-react";
import { Card } from "../../../../components/ui/Card";
import { cn } from "../../../../utils/classNames";
import { Template } from "../../types";

interface Props {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}

export function TemplateCard({ template, isSelected, onClick }: Props) {
  const Icon = template.icon;

  return (
    <button onClick={onClick} className="text-left w-full group">
      <Card
        className={cn(
          "p-3 h-full transition-all duration-200",
          "hover:scale-[1.02] hover:shadow-lg",
          isSelected && "ring-2 ring-black",
          "relative overflow-hidden"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-black/[0.08] pointer-events-none" />
        <div className="relative space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-black/5 text-black/60">
              <Icon className="h-5 w-5" />
            </div>
            <Play className="h-4 w-4 text-black/40 group-hover:text-black transition-colors" />
          </div>
          <div>
            <p className="font-medium leading-none mb-1 text-xs sm:text-sm">
              {template.title}
            </p>

            <p className="text-xs sm:text-sm text-black/60">
              {template.description}
            </p>
          </div>
        </div>
      </Card>
    </button>
  );
}
