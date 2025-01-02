import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const Home = () => {
  const navigate = useNavigate();
  const playersAmount = 4;
  const [page, setPage] = useState(1);
  const [lobbies, setLobbies] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/game/waiting");
        console.log(response.data);
        setLobbies(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleNavigation = (gameData: GameData) => {
    navigate("/wait-for-game", { state: gameData });
  };

  const handleJoinGame = (gameData: GameData, team: string, joinGameCode: string) => {
    const joinGameRequestData = {
      team: team,
      joinGameCode: joinGameCode,
    };

    axios
      .post(`/game/${gameData.gameId}/join`, joinGameRequestData)
      .then((response) => {
        console.log(response);
        handleNavigation(gameData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center h-100 p-3">
      {/* Create Game Button */}
      <div className="w-50 mb-4 mt-2">
        <Link
          to="/create-game"
          className="custom-create-game-btn btn btn-primary border border-black border-opacity-25 w-100 w-md-auto fw-bold"
        >
          Create Game
        </Link>
      </div>

      <div className="row w-100">
        {/* Left Column: News and Create Game Button */}
        <div className="col-12 col-md-4 mb-3">
          {/* News Section */}
          <div>
            <h1>News</h1>
            <p>
              We are currently working hard to improve the app! A new iOS version
              is in development, which will bring smoother gameplay and additional
              features for iPhone users. Stay tuned for updates as we roll out new
              enhancements for all platforms.
            </p>
          </div>
        </div>

        {/* Right Column: Lobby Table */}
        <div className="col-12 col-md-8 mb-3">
          <div className="custom-lobby-div d-flex flex-column w-100 border border-black border-opacity-25 border-2">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
              <p className="fw-bold m-0">Lobby name</p>
              <p className="fw-bold m-0">Game type</p>
              <p className="fw-bold m-0">Players</p>
            </div>
            {/* Lobbies Info */}
            {loading ? (
              <div className="d-flex justify-content-center align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
                <p className="m-0">Loading...</p>
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
                className="d-flex align-items-center gap-2 text-black fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  page > 1 && setPage(page - 1);
                }}
              >
                <i className="bi bi-arrow-left"></i>
                <p className="m-0">Prev</p>
              </div>
              <p className="fw-bold m-0">Page {page}</p>
              <div
                className="d-flex align-items-center gap-2 text-black fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                <p className="m-0">Next</p>
                <i className="bi bi-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;