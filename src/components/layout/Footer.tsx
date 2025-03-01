import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/context/useAuth";
import { useLanguage } from "../../features/auth/context/LanguageContext";
import { getTranslation } from "../../utils/translations";

export function Footer() {
  const { user } = useAuth();
  const { language } = useLanguage();
  return (
    <footer className="py-8 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center space-x-8">
          <FooterLink href="/privacy">
            {getTranslation(language, "footer.privacy")}
          </FooterLink>
          <FooterLink href="/terms">
            {getTranslation(language, "footer.terms")}
          </FooterLink>
          <FooterLink href="/contact">
            {getTranslation(language, "footer.contact")}
          </FooterLink>
          {user && (
            <FooterLink href="/report">
              {getTranslation(language, "footer.report")}
            </FooterLink>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="text-sm text-black/40 hover:text-black transition-colors"
    >
      {children}
    </Link>
  );
}
