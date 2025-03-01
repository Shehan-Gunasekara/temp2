import { useState } from "react";
import { NavBrand } from "./NavBrand";
import { NavLinks } from "./NavLinks";
import { NavActions } from "./NavActions";

export function Navigation() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-black/5 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="hidden lg:flex items-center justify-between h-16 ">
          <NavBrand />
          <NavLinks />
          <NavActions />
        </div>{" "}
        <div className="flex lg:hidden items-center justify-between h-16 ">
          <NavBrand />
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Toggle Menu</span>
            <svg
              className="h-6 w-6 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>{" "}
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md flex flex-col gap-5 justify-end items-end pr-6 pb-5">
          <NavLinks />
          <NavActions />
        </div>
      )}
    </nav>
  );
}
