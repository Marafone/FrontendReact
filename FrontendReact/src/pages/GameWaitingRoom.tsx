import { Client, IMessage } from "@stomp/stompjs";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/game-waiting-room.css";

interface waitingRoomContent {
  gameId: number;
  gameName: string;
  gameType: string;
  joinedPlayersAmount: number;
}

const GameWaitingRoom = () => {
  var maxPlayersAmount = 4;
  const location = useLocation();
  const gameContent: waitingRoomContent = location.state;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const onMessageReceived = (msg: IMessage) => {
      console.log("MsgReceived: " + msg.body);
    };

    const onConnected = () => {
      client.subscribe(`/topic/game/${gameContent.gameId}`, onMessageReceived);
      client.subscribe(`/user/queue/game/`, onMessageReceived);
    };

    const onError = () => {
      console.log("error");
    };

    const client = new Client({
      brokerURL: `${baseUrl}/game`,
      // debug: (str) => console.log(str),
      onConnect: onConnected,
      onStompError: onError,
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <>
      <div
        className="d-flex flex-column justify-content-evenly align-items-center min-vh-100 min-vw-100"
        style={{ backgroundColor: "#FFC058" }}
      >
        {/* Lobby */}
        <div className="custom-lobby w-75 p-3">
          {/* header */}
          <div>
            <div className="d-flex flex-row justify-content-between align-items-center px-3 py-2">
              <h2>{gameContent.gameName}</h2>
              <Link to="/" className="btn btn-danger fw-bold">
                Exit
              </Link>
            </div>
            <hr className="border border-black border-2 opacity-50 mt-0 mx-3" />
          </div>
          {/* teams */}
          {/* TODO - MANAGE PLAYERS OPTIONS */}
          <div className="d-flex justify-content-evenly">
            <div className="d-flex flex-column align-items-center">
              <button className="btn btn-danger fw-bold mb-4">Red</button>
              <p className="custom-player text-danger fw-bold px-3 py-1 rounded-4">
                Fabrizio
              </p>
              <p className="custom-player text-danger px-3 py-1 rounded-4">
                Gianluigi
              </p>
              {/* TODO - DISPLAY TEAM RED */}
            </div>
            <div className="d-flex flex-column align-items-center">
              <button className="btn btn-success fw-bold mb-4">Green</button>
              <p className="custom-player text-success px-3 py-1 rounded-4">
                Luca
              </p>
              <p className="custom-player text-success px-3 py-1 rounded-4">
                Pino
              </p>
              {/* TODO - DISPLAY TEAM GREEN */}
            </div>
          </div>
          {/* game info */}
          <div className="d-flex flex-column align-items-center mt-3">
            <p>
              <span className="fw-bold">Game Type: </span>
              {gameContent.gameType}
            </p>
            <p>
              <span className="fw-bold">Players: </span>
              {gameContent.joinedPlayersAmount}/{maxPlayersAmount}
            </p>
            <button className="btn btn-success fw-bold border border-black border-opacity-25">
              Start game
            </button>
          </div>
        </div>
        {/* Events */}
        <div className="custom-events d-flex flex-column align-items-center w-50 px-3 py-2">
          {" "}
          {/* TODO FIXED SIZE OF CHAT */}
          <h2>Events</h2>
          <hr className="border border-black border-2 opacity-50 mt-0 w-100" />
          <p className="me-auto">Have fun!</p>
          <p className="me-auto">Fabrizio joined the game.</p>
          <p className="me-auto">Leonardo left the game.</p>
        </div>
      </div>
    </>
  );
};

export default GameWaitingRoom;
