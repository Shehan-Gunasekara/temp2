import React, { useState, useEffect } from "react";
import { Languages, X } from "lucide-react";
import { useLanguage } from "../../../features/auth/context/LanguageContext";

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
];

export function LanguageDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  // const [selectedLanguage, setSelectedLanguage] = useState<Language>(
  //   languages[0]
  // );
  // useEffect(() => {
  //   const elements = document.querySelectorAll(
  //     "p, h1, h2, h3, h4, h5, h6, span, button"
  //   );
  //   setTranslateElements(Array.from(elements));
  // }, []);

  // const translateText = async (text: string, targetLang: string) => {
  //   try {
  //     const response = await fetch(
  //       `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
  //         text
  //       )}`
  //     );
  //     const data = await response.json();
  //     return data[0][0][0];
  //   } catch (error) {
  //     console.error("Translation error:", error);
  //     return text;
  //   }
  // };

  // const handleLanguageChange = async (language: Language) => {
  //   if (language.code === selectedLanguage.code) {
  //     setIsOpen(false);
  //     return;
  //   }

  //   setSelectedLanguage(language);

  //   translateElements.forEach((element) => {
  //     if (!element.getAttribute("data-original-text")) {
  //       element.setAttribute("data-original-text", element.textContent || "");
  //     }
  //   });

  //   for (const element of translateElements) {
  //     const originalText = element.getAttribute("data-original-text") || "";
  //     if (language.code === "en") {
  //       element.textContent = originalText;
  //     } else {
  //       const translatedText = await translateText(originalText, language.code);
  //       element.textContent = translatedText;
  //     }
  //   }

  //   setIsOpen(false);
  // };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as "en" | "de");
    localStorage.setItem("language", lang);
  };

  return (
    <>
      {/* Language Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-black text-white rounded-full shadow-lg hover:bg-black/90 transition-all duration-200 z-50 flex items-center gap-2"
        aria-label="Toggle language selection"
      >
        <Languages className="w-6 h-6" />
        <span className="text-sm font-medium hidden md:inline">
          {language == "en" ? "English" : "German"}
        </span>
      </button>

      {/* Language Drawer - Simplified for two languages */}
      <div
        className={`fixed bottom-24 right-6 bg-white rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-2">
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => handleLanguageChange(item.code)}
              className={`w-full sm:px-8 px-4 py-3 flex items-center gap-4 rounded-lg transition-colors ${
                language === item.code
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="sm:text-xl text-sm">{item.flag}</span>
              <div className="text-left">
                <div className="font-medium sm:text-sm text-xs">
                  {item.name}
                </div>
                <div className="text-xs opacity-80">{item.nativeName}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}