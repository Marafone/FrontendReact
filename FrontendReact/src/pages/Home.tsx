import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";

enum GameType {
  Maraffa = "Maraffa",
  Briscolla = "Briscolla",
  Trisette = "Trisette",
}

interface gameData {
  gameId: number;
  gameName: string;
  gameType: GameType;
  joinedPlayersAmount: number;
}

const Home = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const playersAmount = 4;
  const [page, setPage] = useState(1);
  const [lobbies, setLobbies] = useState<gameData[]>([]);
  const [loading, setLoading] = useState(true);
  const lobbiesMenuColor = "#FFC360";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/game/waiting`);
        setLobbies(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center container-fluid h-100">
      {/* news and creation button */}
      <div
        className="d-flex flex-column justify-content-evenly align-items-center w-50"
        style={{ height: "492px" }}
      >
        <div className="w-75">
          <Link
            to="/create-game"
            className="w-100 btn border border-black border-opacity-25 fw-bold"
            style={{ backgroundColor: lobbiesMenuColor }}
          >
            Create Game
          </Link>
        </div>
        <div className="w-75">
          <h1>News</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Perspiciatis, quo itaque praesentium cupiditate facere
            necessitatibus? Qui veniam fuga ipsa accusamus unde impedit soluta,
            magnam sed blanditiis facilis est magni aperiam tempore, laudantium
            quos quam temporibus illo esse reprehenderit quasi corporis
            accusantium iusto id reiciendis. Sunt, laudantium rem culpa
            consectetur debitis sequi, illo quidem iste, deserunt consequuntur
            quam reprehenderit temporibus atque tenetur beatae dolor dicta
            fugiat enim reiciendis ullam repellendus! Mollitia aspernatur totam,
            sunt distinctio dignissimos eum pariatur nostrum veritatis unde
            incidunt impedit recusandae odit deserunt ullam minus facere
            quibusdam natus! Tempore consectetur itaque nesciunt veritatis?
            Deleniti sint eveniet sapiente libero.
          </p>
        </div>
      </div>
      {/* lobby div */}
      <div className="d-flex justify-content-center align-items-center w-50">
        <div
          className="d-flex flex-column w-75 border border-black border-opacity-25 border-2"
          style={{ backgroundColor: lobbiesMenuColor, height: "492px" }} // max 10 lobbies at one page
        >
          {/* header */}
          <div className="d-flex justify-content-between align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
            <p className="fw-bold m-0">Lobby name</p>
            <p className="fw-bold m-0">Game type</p>
            <p className="fw-bold m-0">Players</p>
          </div>
          {/* lobbies info */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
              <p className="m-0">Loading...</p>
            </div>
          ) : (
            lobbies.map((l) => (
              <div
                key={l.gameId}
                className="d-flex justify-content-between align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2"
              >
                <p className="m-0">{l.gameName}</p>
                <p className="m-0">{l.gameType}</p>
                <p className="m-0">
                  {l.joinedPlayersAmount}/{playersAmount}
                </p>
              </div>
            ))
          )}
          {/* next page div*/}
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
  );
};

export default Home;
