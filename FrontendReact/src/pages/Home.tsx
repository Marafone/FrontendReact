import axiosWithLogout from "../axios";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/home-page.css";
import { useUserContext } from "../context/UserContext";

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

const Home = () => {
  const navigate = useNavigate();
  const playersAmount = 4;
  const [page, setPage] = useState(1);
  const [lobbies, setLobbies] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  // reconnection option
  const [isReconnectionPossible, setIsReconnectionPossible] = useState(false);
  const [reconnectableGameId, setReconnectableGameId] = useState<bigint>(
    BigInt(0)
  );

  const context = useContext(LanguageContext);
  const { username, setUsername } = useUserContext();

  const { theme } = useTheme();

  if (!context) {
    throw new Error("LanguageContext must be used within a LanguageProvider.");
  }

  const { translate } = context; // Now `context` is guaranteed to be defined

  useEffect(() => {
      if (username == null) // only send request to get active games when user is logged in
        return
    
      axios // use standard axios to not redirect to login on 401 http status code received
      .get("/game/active", {
        transformResponse: [(data) => data], // disable automatic parsing
      })
      .then((response) => {
        if (response.data) {
          setIsReconnectionPossible(true);
          setReconnectableGameId(response.data);
        }
      }).catch((error) => {
        if(error.response.status == 401){
          setUsername(null)
        }
        console.log(error)
      });
  }, []);

  useEffect(() => {
    const fetchGames = () => {
      axiosWithLogout.get("/game/waiting").then((response) => {
        setLobbies(response.data);
      });
    };
    setLoading(true);
    fetchGames()
    setLoading(false);

    //keep refreshing games
    const intervalID = setInterval(fetchGames, 4000);

    return () => clearInterval(intervalID)
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

    axiosWithLogout
      .post(`/game/${gameData.gameId}/join`, joinGameRequestData)
      .then(() => {
        handleNavigation(gameData);
      });
  };

  const handleReconnect = (gameId: bigint) => {
    setIsReconnectionPossible(false);
    navigate("/play-game", {
      state: { gameId: BigInt(gameId) },
    });
  };

  return (
    <>
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
            {translate("home.createGameBtn")} {/* Create Game Button */}
          </Link>
        </div>

        <div className="row w-100">
          {/* Left Column: News and Create Game Button */}
          <div className="col-12 col-md-4 mb-3">
            {/* News Section */}
            <div>
              <h1>{translate("home.newsTitle")}</h1> {/* News Title */}
              <p>{translate("home.newsContent")}</p> {/* News Content */}
            </div>
          </div>

          {/* Right Column: Lobby Table */}
          <div className="col-12 col-md-8 mb-3">
            <div className="custom-lobby-div d-flex flex-column w-100 border border-black border-opacity-25 border-2">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
                <p className="fw-bold m-0">{translate("home.lobbyName")}</p>{" "}
                {/* Lobby Name */}
                <p className="fw-bold m-0">{translate("home.gameType")}</p>{" "}
                {/* Game Type */}
                <p className="fw-bold m-0">{translate("home.players")}</p>{" "}
                {/* Players */}
              </div>
              {/* Lobbies Info */}
              {loading ? (
                <div className="d-flex justify-content-center align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
                  <p className="m-0">{translate("home.loading")}</p>{" "}
                  {/* Loading */}
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
                  <p className="m-0">{translate("home.prevPage")}</p>{" "}
                  {/* Prev */}
                </div>
                <p className="fw-bold m-0">
                  {translate("home.pageText")} {page}
                </p>{" "}
                {/* Page Text */}
                <div
                  className="d-flex align-items-center gap-2 fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  <p className="m-0">{translate("home.nextPage")}</p>{" "}
                  {/* Next */}
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
