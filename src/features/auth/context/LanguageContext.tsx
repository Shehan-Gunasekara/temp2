"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { translations, AvailableLanguages } from "../../../utils/translations";

interface LanguageProviderProps {
  language: AvailableLanguages;
  setLanguage: (lang: AvailableLanguages) => void;
}

const LanguageContext = createContext<LanguageProviderProps | undefined>(
  undefined
);

const getBrowserLanguage = (): AvailableLanguages => {
  if (
    typeof navigator !== "undefined" &&
    import.meta.env.VITE_SITE_NAMAE == "UGC ADS"
  ) {
    const browserLanguage = navigator.language.split("-")[0]; // Get the base language code (e.g., 'fr' from 'fr-FR')
    const supportedLanguages = Object.keys(
      translations
    ) as AvailableLanguages[]; // Get supported languages from translations
    if (supportedLanguages.includes(browserLanguage as AvailableLanguages)) {
      return browserLanguage as AvailableLanguages;
    }
  }
  return "en"; // Default to English if the browser language is not supported or navigator is not defined
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<AvailableLanguages>(
    getBrowserLanguage()
  );

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      import.meta.env.VITE_SITE_NAMAE != "UGC ADS"
    )
      return;
    const browserLanguage = localStorage.getItem(
      "language"
    ) as AvailableLanguages;

    if (browserLanguage) {
      setLanguage(browserLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageProviderProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("LanguageProvider must be initialized");
  }
  return context;
};
