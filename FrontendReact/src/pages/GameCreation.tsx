import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      newErrors.gameName = `Length must be between ${minGameNameLength} and ${maxGameNameLength} characters`;
    }

    if (isGamePrivate && !formData.password) {
      newErrors.password = "Password cannot be empty";
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
            gameName: "Game name already taken. Try with the other name.",
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
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <div className="custom-game-creation-div d-flex flex-column justify-content-center align-items-center w-75 h-75 border border-black border-opacity-50 p-3">
        <p className="fs-2 fw-bold">Create Game</p>
        <form className="d-flex flex-column gap-4">
          {/* Game Name input group */}
          <div className="input-group position-relative">
            <span className="fw-medium input-group-text border border-black border-opacity-50 custom-form-element">
              Game Name
            </span>
            <input
              type="text"
              className="form-control border border-black border-opacity-25 custom-input custom-form-element"
              placeholder="SampleName123"
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
              Game Type
            </span>
            <select
              className="form-control border border-black border-opacity-25 custom-input custom-form-element"
              name="gameType"
              value={formData?.gameType}
              onChange={handleChange}
            >
              <option value="MARAFFA">Maraffa</option>
              <option value="BRISCOLLA">Briscolla</option>
              <option value="TRISETTE">Trisette</option>
            </select>
          </div>
          {/* Private input group */}
          <div className="form-check form-switch">
            <input
              className="form-check-input border-0 custom-form-element"
              type="checkbox"
              onClick={() => setIsGamePrivate(!isGamePrivate)}
            />
            <label className="fw-medium form-check-label">Private</label>
          </div>
          {/* Password input group */}
          {isGamePrivate && (
            <div className="input-group">
              <span className="fw-medium input-group-text border border-black border-opacity-50 custom-form-element">
                Password
              </span>
              <input
                type="password"
                className="form-control border border-black border-opacity-25 custom-input custom-form-element"
                placeholder="password123"
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
          {/* TODO - GAME CREATED SUCCESSFULLY INFO */}
          {/* Create Game button */}
          <div>
            <button
              className="custom-btn btn fw-bold w-100 custom-form-element border border-black border-opacity-25"
              type="button"
              onClick={() => {
                createGame();
              }}
            >
              Create Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameCreation;
