import { Play } from 'lucide-react';

export function PlayButton() {
  return (
    <button className="absolute inset-0 flex items-center justify-center group">
      <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
        <Play className="h-8 w-8 text-black ml-1" />
      </div>
    </button>
  );
}