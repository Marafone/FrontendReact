import React, { useEffect, useState, useContext } from "react";
import "../styles/game-creation-form.css";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from 'react-toastify';
import axiosWithLogout from "../axios";

type GameType = "MARAFFA" | "BRISCOLLA" | "TRISETTE";

interface FormData {
  gameName: string;
  gameType: GameType;
  password: string;
  pointsToWin: number;
}

const GameCreation = () => {
  const [isGamePrivate, setIsGamePrivate] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    gameName: "",
    gameType: "MARAFFA",
    password: "",
    pointsToWin: 21,
  });

  const navigate = useNavigate();

  // Use the LanguageContext
  const { translate } = useContext(LanguageContext)!;

  const { theme } = useTheme();

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
    const gameNameTrimmed = formData.gameName.trim();
    const minGameNameLength = 4;
    const maxGameNameLength = 20;

    if (
      gameNameTrimmed.length < minGameNameLength ||
      gameNameTrimmed.length > maxGameNameLength
    ) {
      toast.error(translate("errors.gameNameLength"));
      return false
    }

    if (isGamePrivate && !formData.password) {
      toast.error(translate("errors.passwordEmpty"));
      return false
    }

    return true;
  };

  function createGame() {
    if (!validateFormData()) return;

    axiosWithLogout
      .post<string>("/game/create", formData, {
        transformResponse: [(data) => data], // disable automatic parsing
      })
      .then((response) => {
        const gameId = BigInt(response.data);
        handleNavigation(gameId);
      });
  }

  const handleNavigation = (gameId: bigint) => {
    navigate("/wait-for-game", {
      state: { gameId, ...formData, joinedPlayersAmount: 1 },
    });
  };

  return (
    <>
      <div className="custom-game-creation-div d-flex flex-column justify-content-center align-items-center w-75 border border-black border-opacity-50 p-4">
        <p className="fs-2 fw-bold">{translate("home.createGameBtn")}</p>{" "}
        <form className="d-flex flex-column gap-4">
          {/* Game Name input group */}
          <div className="input-group position-relative">
            <span className="fw-medium input-group-text border border-black border-opacity-50 custom-form-element">
              {translate("home.lobbyName")}
            </span>
            <input
              type="text"
              className="form-control border border-black border-opacity-25 custom-input custom-form-element"
              placeholder={translate("placeholders.gameName")}
              name="gameName"
              value={formData?.gameName}
              onChange={handleChange}
              required
            />
          </div>
          {/* Game Type input group */}
          <div className="input-group">
            <span className="fw-medium input-group-text border border-black border-opacity-50 custom-form-element">
              {translate("home.gameType")}
            </span>
            <select
              id="gameType"
              className="form-control border border-black border-opacity-25 custom-input custom-form-element"
              name="gameType"
              value={formData?.gameType}
              onChange={handleChange}
            >
              <option value="MARAFFA">{translate("gameTypes.marafone")}</option>{" "}
              <option value="BRISCOLLA">{translate("gameTypes.briscola")}</option>{" "}
              <option value="TRISETTE">{translate("gameTypes.tresette")}</option>{" "}
            </select>
          </div>
          {/* PointsToWin input group */}
          <div className="input-group position-relative">
            <span className="fw-medium input-group-text border border-black border-opacity-50 custom-form-element">
              {translate("home.points")}
            </span>
            <select
              id="pointsToWin"
              className="form-control border border-black border-opacity-25 custom-input custom-form-element"
              name="pointsToWin"
              value={formData?.pointsToWin}
              onChange={handleChange}
            >
              <option value="21">21</option>
              <option value="31">31</option>
              <option value="41">41</option>
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
              {translate("labels.private")}
            </label>
          </div>
          {/* Password input group */}
          {isGamePrivate && (
            <div className="input-group">
              <span className="fw-medium input-group-text border border-black border-opacity-50 custom-form-element">
                {translate("login.password")}
              </span>
              <input
                id="joinGameCode"
                type="password"
                className="form-control border border-black border-opacity-25 custom-input custom-form-element"
                placeholder={translate("placeholders.password")}
                name="password"
                value={formData?.password}
                onChange={handleChange}
              />
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
              {translate("home.createGameBtn")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GameCreation;
