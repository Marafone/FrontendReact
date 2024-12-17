import axios from "axios";
import React, { useState } from "react";

type GameType = "MARAFFA" | "BRISCOLLA" | "TRISETTE" | "";

interface FormData {
  gameName: string;
  gameType: GameType;
  password: string;
}

const GameCreation = () => {
  const [isGamePrivate, setIsGamePrivate] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    gameName: "",
    gameType: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    if (gameNameTrimmed.length <= 3 || gameNameTrimmed.length > 20) {
      newErrors.gameName = "Length must be between 4 and 20 characters";
    }

    if (isGamePrivate && !formData.password) {
      newErrors.password = "Password cannot be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function createPrivateGame() {
    if (!validateFormData()) return;
    console.log("Private game creation.");
    console.log(formData);
    // TODO create private game request
  }

  function createPublicGame() {
    if (!validateFormData()) return;
    console.log("Public game creation.");
    console.log(formData);
    // TODO create public game request
  }

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
          {/* Create Game button */}
          <div>
            <button
              className="custom-btn btn fw-bold w-100 custom-form-element border border-black border-opacity-25"
              type="button"
              onClick={() => {
                isGamePrivate ? createPrivateGame() : createPublicGame();
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
