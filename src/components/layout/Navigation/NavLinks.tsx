import React from "react";
import { cn } from "../../../utils/classNames";
import { getTranslation } from "../../../utils/translations";
import { useLanguage } from "../../../features/auth/context/LanguageContext";

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  isNew?: boolean;
}

function NavLink({ href, isActive, children, isNew }: NavLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="relative">
      {isNew && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      )}
      <button
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          "hover:bg-black/5",
          isActive ? "text-black bg-black/5" : "text-black/40"
        )}
        onClick={handleClick}
      >
        {children}
      </button>
    </div>
  );
}

export function NavLinks() {
  const currentPath = window.location.pathname;
  const { language } = useLanguage();
  return (
    <div className="flex items-center justify-center space-x-1">
      <NavLink
        href="/ugc-actor"
        isActive={currentPath === "/ugc-actor" || currentPath === "/"}
      >
        {getTranslation(language, "navBar.ugc_actor")}
      </NavLink>
      <NavLink
        href="/consistent-actor"
        isActive={currentPath === "/consistent-actor"}
        isNew={false}
      >
        {getTranslation(language, "navBar.consistent_actor")}
      </NavLink>
      <NavLink
        href="/ai-gallery"
        isActive={currentPath === "/ai-gallery"}
        isNew={false}
      >
        {getTranslation(language, "navBar.ai_actor_gallery")}
      </NavLink>
      <NavLink
        href="/template-editor"
        isActive={currentPath === "/template-editor"}
        isNew={true}
      >
        {getTranslation(language, "navBar.template_editor")}
      </NavLink>

      <NavLink href="/gallery" isActive={currentPath === "/gallery"}>
        {getTranslation(language, "navBar.gallery")}
      </NavLink>
    </div>
  );
}
