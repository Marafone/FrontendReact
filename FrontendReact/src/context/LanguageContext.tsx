import { createContext, useState, ReactNode } from "react";
import { translations } from "../translations";

/*
  Language context to easily translate UI to multiple languages.
*/

export interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (key: string) => string; // Translation function
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

  const translate = (key: string) => {
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
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};