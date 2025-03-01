import React from "react";
import { Sparkles } from "lucide-react";

export function NavBrand() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", "/ugc-actor");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-2 text-black"
    >
      <Sparkles className="h-5 w-5" />
      <span className="text-base sm:text-lg font-medium">
        {import.meta.env.VITE_SITE_NAMAE}{" "}
      </span>
    </button>
  );
}
