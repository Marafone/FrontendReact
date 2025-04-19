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

  const { translate } = context; // Now `context` is guaranteed to be defined

  const { theme } = useTheme();

  useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  return (
    <>
      <Navbar />
      <div className="rules-page d-flex justify-content-center align-items-center container-fluid h-100">
        <div className="rules-content">
          <h1 className="text-center">{translate("rules.title")}</h1> {/* Rules Title */}
          
          <p>
            <strong>{translate("rules.gameName")}</strong>, {translate("rules.gameAlias")} 
            {translate("rules.description")}
          </p>

          <p>{translate("rules.deckDescription")}</p>
          
          <p>{translate("rules.pointsDescription")}</p>
          
          <p>{translate("rules.teamDescription")}</p>
          
          <p>{translate("rules.firstHand")}</p>
          
          <p>{translate("rules.maraffaBonus")}</p>
          
          <p>{translate("rules.trickRules")}</p>
          
          <p>{translate("rules.handConclusion")}</p>

          <div className="image-container">
            {loading ? (
              <p>{translate("rules.loadingImage")}</p>
            ) : (
              <img
                src="/images/cards.png"
                alt={translate("rules.imageAlt")} // Corrected usage of the alt attribute
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