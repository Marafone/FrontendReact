import { Client, IMessage } from "@stomp/stompjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import {
  GameStartedEvent,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  TeamStateEvent,
} from "../events/game-waiting-room/WebSocketEventTypes";
import "../styles/game-waiting-room.css";

interface waitingRoomContent {
  gameId: bigint;
  gameName: string;
  gameType: string;
  joinedPlayersAmount: number;
}

type WebSocketEventType =
  | TeamStateEvent
  | PlayerJoinedEvent
  | PlayerLeftEvent
  | GameStartedEvent;

var client: Client;

const GameWaitingRoom = () => {
  var maxPlayersAmount = 4;
  const location = useLocation();
  const gameContent: waitingRoomContent = location.state;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [teamRed, setTeamRed] = useState<string[]>([]);
  const [teamBlue, setTeamBlue] = useState<string[]>([]);
  const [playersAmount, setPlayersAmount] = useState(1);
  const [eventMessages, setEventMessages] = useState<string[]>(["Have fun!"]);
  const { username, setUsername } = useUserContext();
  const navigate = useNavigate();

  // HELPER FUNCTIONS

  const handleStartGame = () => {
    client.publish({ destination: `/app/game/${gameContent.gameId}/start` });
  };

  const handleLeaveGame = () => {
    axios
      .post(`${baseUrl}/game/${gameContent.gameId}/leave`)
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((error) => console.log(error));
  };

  const handleChangeTeam = (team: string) => {
    axios
      .post(`${baseUrl}/game/${gameContent.gameId}/team/change`, team, {
        headers: {
          "Content-Type": "text/plain",
        },
      })
      .catch((error) => console.log(error));
  };

  // WEBSOCKET FUNCTIONS

  const onMessageReceived = (msg: IMessage) => {
    const events: WebSocketEventType[] = JSON.parse(msg.body);
    events.forEach((event) => {
      switch (event.eventType) {
        case "TeamState":
          handleTeamStateEvent(event.redTeam, event.blueTeam);
          break;
        case "PlayerJoinedEvent":
          handlePlayerJoinedEvent(event);
          break;
        case "GameStartedEvent":
          handleGameStartedEvent();
          break;
        case "PlayerLeftEvent":
          handlePlayerLeftEvent(event.playerName);
          break;
        default:
          break;
      }
    });
  };

  function handleTeamStateEvent(redTeam: string[], blueTeam: string[]) {
    // change teams information
    setTeamRed(redTeam);
    setTeamBlue(blueTeam);
  }

  function handlePlayerJoinedEvent(event: PlayerJoinedEvent) {
    // edit event messages
    const newEventMessage = event.playerName + " joined the game!";
    setEventMessages((prevMessages) => [...prevMessages, newEventMessage]);
    // edit amount of players
    setPlayersAmount((prevAmount) => prevAmount + 1);
    // edit displayed teams
    if (event.team === "RED") {
      setTeamRed((previousTeamRed) => [...previousTeamRed, event.playerName]);
    } else if (event.team === "BLUE") {
      setTeamBlue((previousTeamBlue) => [
        ...previousTeamBlue,
        event.playerName,
      ]);
    }
  }

  const handleGameStartedEvent = () => {
    navigate("/play-game", {
      state: { gameId: gameContent.gameId },
    });
  };

  function handlePlayerLeftEvent(playerName: string) {
    // edit event messages
    const newEventMessage = playerName + " left the game!";
    setEventMessages((prevMessages) => [...prevMessages, newEventMessage]);
    // edit amount of players
    setPlayersAmount((prev) => prev - 1);
    // edit displayed teams
    setTeamRed((prevTeamRed) =>
      prevTeamRed.filter(
        (teamRedPlayerName) => teamRedPlayerName !== playerName
      )
    );
    setTeamBlue((prevTeamBlue) =>
      prevTeamBlue.filter(
        (teamBluePlayerName) => teamBluePlayerName !== playerName
      )
    );
  }

  // USE EFFECT HOOK

  useEffect(() => {
    const createWebSocketConnection = () => {
      client = new Client({
        brokerURL: `${baseUrl}/game`,
        // debug: (str) => console.log(str),
        onConnect: onConnected,
        onStompError: onError,
      });

      client.activate();
    };

    const onConnected = () => {
      if (client && client.connected)
        client.subscribe(
          `/topic/game/${gameContent.gameId}`,
          onMessageReceived
        );
      else console.log("STOMP Connection is not established yet!");
    };

    const onError = (err: any) => {
      console.log("WebSocket connection error: " + err);
    };

    createWebSocketConnection();

    // function to get all the information necessary for user when joining game

    const getBeginningGameInformation = () => {
      axios
        .get(`${baseUrl}/game/${gameContent.gameId}/teams`)
        .then((response) => {
          const newTeamRed: string[] = [];
          const newTeamBlue: string[] = [];
          response.data.RED.forEach((x: any) =>
            newTeamRed.push(x.user.username)
          );
          response.data.BLUE.forEach((x: any) =>
            newTeamBlue.push(x.user.username)
          );
          setTeamRed(newTeamRed);
          setTeamBlue(newTeamBlue);
          setPlayersAmount(newTeamRed.length + newTeamBlue.length);
        })
        .catch((error) => console.log(error));
    };

    getBeginningGameInformation();

    return () => {
      if (client?.connected) {
        client.unsubscribe(`/topic/game/${gameContent.gameId}`);
        client.deactivate();
      }
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
              <button
                className="btn btn-danger fw-bold"
                onClick={handleLeaveGame}
              >
                Exit
              </button>
            </div>
            <hr className="border border-black border-2 opacity-50 mt-0 mx-3" />
          </div>
          {/* teams */}
          {/* TODO - MANAGE PLAYERS OPTIONS */}
          <div className="d-flex justify-content-evenly">
            <div className="d-flex flex-column align-items-center">
              <button
                className="btn btn-danger fw-bold mb-4"
                onClick={() => handleChangeTeam("RED")}
              >
                Red
              </button>
              {teamRed.map((player) => (
                <p
                  key={player}
                  className={`custom-player text-danger px-3 py-1 rounded-4 ${
                    username === player ? "fw-bold" : ""
                  }`}
                >
                  {player}
                </p>
              ))}
            </div>
            <div className="d-flex flex-column align-items-center">
              <button
                className="btn btn-primary fw-bold mb-4"
                onClick={() => handleChangeTeam("BLUE")}
              >
                Blue
              </button>
              {teamBlue.map((player) => (
                <p
                  key={player}
                  className={`custom-player text-primary px-3 py-1 rounded-4 ${
                    username === player ? "fw-bold" : ""
                  }`}
                >
                  {player}
                </p>
              ))}
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
              {playersAmount}/{maxPlayersAmount}
            </p>
            <button
              className="btn btn-success fw-bold border border-black border-opacity-25"
              onClick={handleStartGame}
            >
              Start game
            </button>
          </div>
        </div>
        {/* Events */}
        <div className="custom-events d-flex flex-column align-items-center w-50 px-3 py-2">
          {" "}
          <h2>Events</h2>
          <hr className="border border-black border-2 opacity-50 mt-0 w-100" />
          <div className="custom-event-messages-container w-100 overflow-auto">
            {eventMessages.map((message, index) => (
              <p key={index} className="me-auto">
                {message}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameWaitingRoom;
