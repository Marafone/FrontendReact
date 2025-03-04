import axios, { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorModal from "../components/ErrorModal";
import LoginRedirectionModal from "../components/LoginRedirectionModal";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/home-page.css";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

enum GameType {
  Maraffa = "Maraffa",
  Briscolla = "Briscolla",
  Trisette = "Trisette",
}

interface GameData {
  gameId: bigint;
  gameName: string;
  gameType: GameType;
  joinedPlayersAmount: number;
}

interface JoinGameResponse {
  code: string;
  message: string;
}

const Home = () => {
  const navigate = useNavigate();
  const playersAmount = 4;
  const [page, setPage] = useState(1);
  const [lobbies, setLobbies] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  // error modal
  const [error, setError] = useState(false);
  const [redirectError, setRedirectError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // reconnection option
  const [isReconnectionPossible, setIsReconnectionPossible] = useState(false);
  const [reconnectableGameId, setReconnectableGameId] = useState<bigint>(
    BigInt(0)
  );

  const context = useContext(LanguageContext);

  const { theme } = useTheme();

  if (!context) {
    throw new Error("LanguageContext must be used within a LanguageProvider.");
  }

  const { t } = context; // Now `context` is guaranteed to be defined

  useEffect(() => {
    axios
      .get("/game/active", {
        transformResponse: [(data) => data], // disable automatic parsing
      })
      .then((response) => {
        if (response.data) {
          setIsReconnectionPossible(true);
          setReconnectableGameId(response.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const fetchGames = () => {
      setLoading(true);
      axios.get("/game/waiting").then((response) => {
        setLobbies(response.data);
        setLoading(false);
      });
    };

    fetchGames();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleNavigation = (gameData: GameData) => {
    navigate("/wait-for-game", { state: gameData });
  };

  const handleJoinGame = (
    gameData: GameData,
    team: string,
    joinGameCode: string
  ) => {
    const joinGameRequestData = {
      team: team,
      joinGameCode: joinGameCode,
    };

    axios
      .post(`/game/${gameData.gameId}/join`, joinGameRequestData)
      .then(() => {
        handleNavigation(gameData);
      })
      .catch((err: AxiosError<JoinGameResponse>) => {
        console.log(err);
        if (err.status == 403) {
          handleRedirectError("Login required to join the game.");
          return;
        }

        if (err.response) handleRequestError(err.response.data.message);
        else handleRequestError(err.message);
      });
  };

  const handleRequestError = (errorMessage: string) => {
    setErrorMessage(errorMessage);
    setError(true);
  };

  const handleRedirectError = (errorMessage: string) => {
    setErrorMessage(errorMessage);
    setRedirectError(true);
  };

  const resetErrorMessage = () => {
    setErrorMessage("");
  };

  const resetError = () => {
    setError(false);
    resetErrorMessage();
  };

  const resetRedirectError = () => {
    setRedirectError(false);
    resetErrorMessage();
  };

  const handleReconnect = (gameId: bigint) => {
    setIsReconnectionPossible(false);
    navigate("/play-game", {
      state: { gameId: BigInt(gameId) },
    });
  };

  return (
    <>
      {error && <ErrorModal message={errorMessage} onClose={resetError} />}
      {redirectError && (
        <LoginRedirectionModal
          message={errorMessage}
          onClose={resetRedirectError}
        />
      )}
      <div className="container-fluid d-flex flex-column align-items-center h-100 p-3 w-100">
        {isReconnectionPossible && (
          <div className="w-50 mb-1 mt-2">
            <button
              className="btn btn-success w-100 fw-bold"
              onClick={() => handleReconnect(reconnectableGameId)}
            >
              Reconnect
            </button>
          </div>
        )}
        {/* Create Game Button */}
        <div className="w-50 mb-4 mt-2">
          <Link
            to="/create-game"
            className="custom-create-game-btn btn btn-primary border border-black border-opacity-25 w-100 w-md-auto fw-bold"
          >
            {t("home.createGameBtn")} {/* Translated Create Game Button */}
          </Link>
        </div>

        <div className="row w-100">
          {/* Left Column: News and Create Game Button */}
          <div className="col-12 col-md-4 mb-3">
            {/* News Section */}
            <div>
              <h1>{t("home.newsTitle")}</h1> {/* Translated News Title */}
              <p>{t("home.newsContent")}</p> {/* Translated News Content */}
            </div>
          </div>

          {/* Right Column: Lobby Table */}
          <div className="col-12 col-md-8 mb-3">
            <div className="custom-lobby-div d-flex flex-column w-100 border border-black border-opacity-25 border-2">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
                <p className="fw-bold m-0">{t("home.lobbyName")}</p>{" "}
                {/* Translated Lobby Name */}
                <p className="fw-bold m-0">{t("home.gameType")}</p>{" "}
                {/* Translated Game Type */}
                <p className="fw-bold m-0">{t("home.players")}</p>{" "}
                {/* Translated Players */}
              </div>
              {/* Lobbies Info */}
              {loading ? (
                <div className="d-flex justify-content-center align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
                  <p className="m-0">{t("home.loading")}</p>{" "}
                  {/* Translated Loading */}
                </div>
              ) : lobbies.length == 0 ? (
                <div className="border-bottom border-black border-opacity-25 border-1 p-2">
                  No games available
                </div>
              ) : (
                lobbies.map((l) => (
                  <div
                    key={l.gameId}
                    className="custom-lobby-div-element d-flex justify-content-between align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2"
                    onClick={() => {
                      const gameData: GameData = {
                        gameId: l.gameId,
                        gameName: l.gameName,
                        gameType: l.gameType,
                        joinedPlayersAmount: l.joinedPlayersAmount,
                      };
                      handleJoinGame(gameData, "RED", "");
                    }}
                  >
                    <p className="m-0">{l.gameName}</p>
                    <p className="m-0">{l.gameType}</p>
                    <p className="m-0">
                      {l.joinedPlayersAmount}/{playersAmount}
                    </p>
                  </div>
                ))
              )}
              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center container-fluid p-2 mt-auto border-black border-top border-opacity-25">
                <div
                  className="d-flex align-items-center gap-2 fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    page > 1 && setPage(page - 1);
                  }}
                >
                  <i className="bi bi-arrow-left"></i>
                  <p className="m-0">{t("home.prevPage")}</p>{" "}
                  {/* Translated Prev */}
                </div>
                <p className="fw-bold m-0">
                  {t("home.pageText")} {page}
                </p>{" "}
                {/* Translated Page Text */}
                <div
                  className="d-flex align-items-center gap-2 fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  <p className="m-0">{t("home.nextPage")}</p>{" "}
                  {/* Translated Next */}
                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
