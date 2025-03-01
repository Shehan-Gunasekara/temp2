import React from 'react';
import { Sparkles } from 'lucide-react';

export function HeroBadge() {
  return (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/5 text-sm mb-8 group hover:bg-black/10 transition-colors cursor-default">
      <Sparkles className="h-4 w-4 mr-2 group-hover:text-black/80 text-black/60 transition-colors" />
      <span className="bg-gradient-to-r from-black/60 to-black bg-clip-text text-transparent">
        AI Actor Generation
      </span>
    </div>
  );
}