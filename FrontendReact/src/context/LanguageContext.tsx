import React, { createContext, useState, ReactNode, useContext } from "react";
import { translations } from "../translations";

export interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string; // Translation function
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>(
    localStorage.getItem("language") || "EN"
  );

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) => {
    // Split the key into path segments (e.g., 'home.title' -> ['home', 'title'])
    const keys = key.split(".");
    let result: any = translations[language];
  
    // Safely navigate through the translation keys
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // If any key is missing, return the original key as a fallback
        return key;
      }
    }
  
    return result || key; // Return the key if the result is still undefined
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};