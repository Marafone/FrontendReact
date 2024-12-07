import { useState } from "react";

enum GameType {
  Maraffa = "Maraffa",
  Briscolla = "Briscolla",
  Trisette = "Trisette",
}

interface gameData {
  lobbyName: string;
  gameType: GameType;
  playersAmount: number;
}

const Home = () => {
  const sampleLobbies: gameData[] = [
    { lobbyName: "lobby1", gameType: GameType.Maraffa, playersAmount: 1 },
    { lobbyName: "lobby2", gameType: GameType.Briscolla, playersAmount: 3 },
    { lobbyName: "lobby3", gameType: GameType.Trisette, playersAmount: 2 },
  ];
  const playersAmount = 4;
  const [page, setPage] = useState(1);
  const [lobbies, setLobbies] = useState<gameData[]>(sampleLobbies);
  const lobbiesMenuColor = "#FAC36099";

  return (
    <div className="d-flex justify-content-evenly align-items-center container-fluid h-100">
      {/* news / chat div */}
      <div className="d-flex justify-content-center align-items-center w-50">
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
          style={{ backgroundColor: lobbiesMenuColor }}
        >
          {/* header */}
          <div className="d-flex justify-content-between align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
            <p className="fw-bold m-0">Lobby name</p>
            <p className="fw-bold m-0">Game type</p>
            <p className="fw-bold m-0">Players</p>
          </div>
          {/* lobbies info */}
          {lobbies.map((l) => (
            <div
              key={l.lobbyName}
              className="d-flex justify-content-between align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2"
            >
              <p className="m-0">{l.lobbyName}</p>
              <p className="m-0">{l.gameType}</p>
              <p className="m-0">
                {l.playersAmount}/{playersAmount}
              </p>
            </div>
          ))}
          {/* next page div*/}
          <div className="d-flex justify-content-between align-items-center container-fluid p-2">
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
