import React, {useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar.tsx";
import "../styles/rules-page.css";
import { useTheme } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

const Rules: React.FC = () => {
  const [loading] = useState(false); // You can set to true if you want a loading simulation initially
  
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("LanguageContext must be used within a LanguageProvider.");
  }

  const { t } = context; // Now `context` is guaranteed to be defined

  const { theme } = useTheme();

  useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  return (
    <>
      <Navbar />
      <div className="rules-page d-flex justify-content-center align-items-center container-fluid h-100">
        <div className="rules-content">
          <h1 className="text-center">{t("rules.title")}</h1> {/* Translated Rules Title */}
          
          <p>
            <strong>{t("rules.gameName")}</strong>, {t("rules.gameAlias")} 
            {t("rules.description")}
          </p>

          <p>{t("rules.deckDescription")}</p>
          
          <p>{t("rules.pointsDescription")}</p>
          
          <p>{t("rules.teamDescription")}</p>
          
          <p>{t("rules.firstHand")}</p>
          
          <p>{t("rules.maraffaBonus")}</p>
          
          <p>{t("rules.trickRules")}</p>
          
          <p>{t("rules.handConclusion")}</p>

          <div className="image-container">
            {loading ? (
              <p>{t("rules.loadingImage")}</p>
            ) : (
              <img
                src="/images/cards.png"
                alt={t("rules.imageAlt")} // Corrected usage of the alt attribute
                className="rules-image"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Rules;