import axios, { AxiosError } from "axios";
import React, {useEffect, useState, useContext } from "react";
import "../styles/game-creation-form.css";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

axios.defaults.withCredentials = true;

type GameType = "MARAFFA" | "BRISCOLLA" | "TRISETTE";

interface FormData {
  gameName: string;
  gameType: GameType;
  password: string;
}

interface Errors {
  [key: string]: string;
}

const GameCreation = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [isGamePrivate, setIsGamePrivate] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    gameName: "",
    gameType: "MARAFFA",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  // Use the LanguageContext
  const { t } = useContext(LanguageContext)!;

  const { theme, toggleTheme } = useTheme();
    
  useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFormData = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const gameNameTrimmed = formData.gameName.trim();
    const minGameNameLength = 4;
    const maxGameNameLength = 20;

    if (
      gameNameTrimmed.length < minGameNameLength ||
      gameNameTrimmed.length > maxGameNameLength
    ) {
      newErrors.gameName = t("errors.gameNameLength"); // Use translation for error message
    }

    if (isGamePrivate && !formData.password) {
      newErrors.password = t("errors.passwordEmpty"); // Use translation for error message
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function createGame() {
    if (!validateFormData()) return;
    // send request
    axios
      .post<string>(`${baseUrl}/game/create`, formData, {
        transformResponse: [(data) => data], // disable automatic parsing
      })
      .then((response) => {
        const gameId = BigInt(response.data);
        handleNavigation(gameId);
      })
      .catch((e: AxiosError) => {
        const errorResponse = e.response?.data;
        if (errorResponse === "GAME_NAME_TAKEN") {
          setErrors({
            gameName: t("errors.gameNameTaken"), // Use translation for error message
          });
        }
      });
  }

  const handleNavigation = (gameId: bigint) => {
    // navigate to waiting lobby
    navigate("/wait-for-game", {
      state: { gameId, ...formData, joinedPlayersAmount: 1 },
    });
  };

  return (
    <div className="main-creation-div d-flex justify-content-center align-items-center w-100 h-100">
      <div className="custom-game-creation-div d-flex flex-column justify-content-center align-items-center w-75 h-75 border border-black border-opacity-50 p-3">
        <p className="fs-2 fw-bold">{t("home.createGameBtn")}</p> {/* Use translation */}
        <form className="d-flex flex-column gap-4">
          {/* Game Name input group */}
          <div className="input-group position-relative">
            <span className="fw-medium input-group-text border border-black border-opacity-50 custom-form-element">
              {t("home.lobbyName")} {/* Use translation */}
            </span>
            <input
              type="text"
              className="form-control border border-black border-opacity-25 custom-input custom-form-element"
              placeholder={t("placeholders.gameName")}
              name="gameName"
              value={formData?.gameName}
              onChange={handleChange}
              required
            />
            {errors.gameName && (
              <div className="text-white bg-danger custom-error-msg rounded mw-100 z-3 px-2 py-1">
                {errors.gameName}
              </div>
            )}
          </div>
          {/* Game Type input group */}
          <div className="input-group">
            <span className="fw-medium input-group-text border border-black border-opacity-50 custom-form-element">
              {t("home.gameType")} {/* Use translation */}
            </span>
            <select
              className="form-control border border-black border-opacity-25 custom-input custom-form-element"
              name="gameType"
              value={formData?.gameType}
              onChange={handleChange}
            >
              <option value="MARAFFA">{t("gameTypes.marafone")}</option> {/* Use translation */}
              <option value="BRISCOLLA">{t("gameTypes.briscola")}</option> {/* Use translation */}
              <option value="TRISETTE">{t("gameTypes.tresette")}</option> {/* Use translation */}
            </select>
          </div>
          {/* Private input group */}
          <div className="form-check form-switch">
            <input
              className="form-check-input border-0 custom-form-element"
              type="checkbox"
              onClick={() => setIsGamePrivate(!isGamePrivate)}
            />
            <label className="fw-medium form-check-label">
              {t("labels.private")} {/* Use translation */}
            </label>
          </div>
          {/* Password input group */}
          {isGamePrivate && (
            <div className="input-group">
              <span className="fw-medium input-group-text border border-black border-opacity-50 custom-form-element">
                {t("login.password")} {/* Use translation */}
              </span>
              <input
                type="password"
                className="form-control border border-black border-opacity-25 custom-input custom-form-element"
                placeholder={t("placeholders.password")}
                name="password"
                value={formData?.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="text-white bg-danger custom-error-msg rounded mw-100 z-3 px-2 py-1">
                  {errors.password}
                </div>
              )}
            </div>
          )}
          {/* Create Game button */}
          <div>
            <button
              className="custom-btn btn fw-bold w-100 custom-form-element border border-black border-opacity-25"
              type="button"
              onClick={() => {
                createGame();
              }}
            >
              {t("home.createGameBtn")} {/* Use translation */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameCreation;