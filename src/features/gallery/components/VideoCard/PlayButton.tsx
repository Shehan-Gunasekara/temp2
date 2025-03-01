import React from 'react';
import { Play } from 'lucide-react';

export function PlayButton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
        <Play className="h-5 w-5 text-black" />
      </div>
    </div>
  );
}