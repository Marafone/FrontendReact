import { Client, IMessage } from "@stomp/stompjs";
import axiosWithLogout from "../axios";
import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ErrorEvent,
  GameStartedEvent,
  OwnerEvent,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  TeamStateEvent,
} from "../events/game-waiting-room/WebSocketEventTypes";
import "../styles/game-waiting-room.css";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { playSound } from "../soundEffects";
import { toast } from 'react-toastify';

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
  | GameStartedEvent
  | ErrorEvent
  | OwnerEvent;

var client: Client;

const GameWaitingRoom = () => {

  // Use the LanguageContext
  const { translate } = useContext(LanguageContext)!;

  var maxPlayersAmount = 4;
  const location = useLocation();
  const gameContent: waitingRoomContent = location.state;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [teamRed, setTeamRed] = useState<string[]>([]);
  const [teamBlue, setTeamBlue] = useState<string[]>([]);
  const [playersAmount, setPlayersAmount] = useState(1);
  const [eventMessages, setEventMessages] = useState<string[]>([
    translate("gameWaitingRoom.events.defaultMessage"),
  ]);
  const [username, setUsername] = useState<string>();
  const navigate = useNavigate();
  // owner info
  const [ownerName, setOwnerName] = useState("");

  // HELPER FUNCTIONS

  const handleStartGame = () => {
    client.publish({ destination: `/app/game/${gameContent.gameId}/start` });
  };

  const handleLeaveGame = () => {
    //unsubcribe first to not get notification about new onwer of lobby
    client.unsubscribe(`/topic/game/${gameContent.gameId}`);
    client.unsubscribe(`/user/queue/game`);
    client.deactivate();

    axiosWithLogout
      .post(`${baseUrl}/game/${gameContent.gameId}/leave`)
      .then(() => {
        navigate("/", { replace: true });
      });
      playSound("/sounds/ui-leave.mp3");
  };

  const handleChangeTeam = (team: string) => {
    axiosWithLogout
      .post(`${baseUrl}/game/${gameContent.gameId}/team/change`, team, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
  };

  const handleAddAI = (team: string) => {
    axiosWithLogout
      .post(`${baseUrl}/game/${gameContent.gameId}/add-ai`, team, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
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
        case "ErrorEvent":
          handleErrorEvent(event.errorMessage);
          break;
        case "OwnerEvent":
          handleOwnerEvent(event.newOwnerName, event.isNew);
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
    setPlayersAmount(redTeam.length + blueTeam.length);
  }

  function handlePlayerJoinedEvent(event: PlayerJoinedEvent) {
    // Append player name to the message
    const newEventMessage = `${event.playerName} ${translate("gameWaitingRoom.events.playerJoined")}`;
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

    playSound("/sounds/ui-join.mp3");
  }

  const handleGameStartedEvent = () => {
    navigate("/play-game", {
      state: { gameId: gameContent.gameId },
    });
  };

  function handlePlayerLeftEvent(playerName: string) {
    // Append player name to the message
    const newEventMessage = `${playerName} ${translate("gameWaitingRoom.events.playerLeft")}`;
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

  const handleErrorEvent = (errorMessage: string) => {
    toast.warn(errorMessage);
  };

  const handleOwnerEvent = (newOwnerName: string, isNew: boolean) => {
    setOwnerName(newOwnerName);
    if (!isNew) return;
    toast.info(`${newOwnerName} ${translate("gameWaitingRoom.info.newOwnerMessageSuffix")}`)
  };

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
      if (client && client.connected) {
        client.subscribe(
          `/topic/game/${gameContent.gameId}`,
          onMessageReceived
        );
        client.subscribe(`/user/queue/game`, onMessageReceived);
        client.publish({
          destination: `/app/game/${gameContent.gameId}/reconnect`,
        });
      }
    };

    const onError = (err: any) => {
      console.log("WebSocket connection error: " + err);
    };

    createWebSocketConnection();

    return () => {
      if (client?.connected) {
        client.unsubscribe(`/topic/game/${gameContent.gameId}`);
        client.unsubscribe(`/user/queue/game`);
        client.deactivate();
      }
    };
  }, []);

  // user data hook

  useEffect(() => {
    axiosWithLogout
      .get(`${baseUrl}/user/info`)
      .then((response) => {
        setUsername(response.data.username);
      });
  }, []);

  // dark mode effect

  const { theme } = useTheme();
  
  useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  return (
    <>
      <div
        className="main-container d-flex flex-column justify-content-evenly align-items-center min-vh-100 min-vw-100"
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
                {translate("gameWaitingRoom.buttons.exit")} {/* Use translation */}
              </button>
            </div>
            <hr className="border border-black border-2 opacity-50 mt-0 mx-3" />
          </div>
          {/* teams */}
          <div className="d-flex justify-content-evenly">
            <div className="d-flex flex-column align-items-center">
              <button
                className="btn btn-danger fw-bold mb-4"
                onClick={() => handleChangeTeam("RED")}
              >
                {translate("gameWaitingRoom.buttons.redTeam")} {/* Use translation */}
              </button>
              {/* Add AI to Red Team */}
              <button
                className="btn fw-bold text-danger mb-2"
                onClick={() => handleAddAI("RED")}
              >
                <i className="bi bi-pc-display-horizontal rounded me-1" /> 
                {translate("gameWaitingRoom.buttons.addAI")}
              </button>
              {teamRed.map((player) => (
                <p
                  key={player}
                  className={`custom-player text-danger px-3 py-1 rounded-4 ${
                    username === player ? "fw-bold" : ""
                  }`}
                >
                  {player == ownerName && (
                    <i className="bi bi-person-badge px-1" />
                  )}
                  {player}
                </p>
              ))}
            </div>
            <div className="d-flex flex-column align-items-center">
              <button
                className="btn btn-primary fw-bold mb-4"
                onClick={() => handleChangeTeam("BLUE")}
              >
                {translate("gameWaitingRoom.buttons.blueTeam")} {/* Use translation */}
              </button>
              {/* Add AI to Blue Team */}
              <button
                className="btn fw-bold text-primary mb-2"
                onClick={() => handleAddAI("BLUE")}
              >
                <i className="bi bi-pc-display-horizontal me-1" />
                {translate("gameWaitingRoom.buttons.addAI")}
              </button>
              {teamBlue.map((player) => (
                <p
                  key={player}
                  className={`custom-player text-primary px-3 py-1 rounded-4 ${
                    username === player ? "fw-bold" : ""
                  }`}
                >
                  {player == ownerName && (
                    <i className="bi bi-person-badge px-1" />
                  )}
                  {player}
                </p>
              ))}
            </div>
          </div>
          {/* game info */}
          <div className="d-flex flex-column align-items-center mt-3">
            <p>
              <span className="fw-bold">{translate("gameWaitingRoom.labels.gameType")}: </span> {/* Use translation */}
              {gameContent.gameType}
            </p>
            <p>
              <span className="fw-bold">{translate("gameWaitingRoom.labels.players")}: </span> {/* Use translation */}
              {playersAmount}/{maxPlayersAmount}
            </p>
            <button
              className="btn btn-success fw-bold border border-black border-opacity-25"
              onClick={handleStartGame}
            >
              {translate("gameWaitingRoom.buttons.startGame")} {/* Use translation */}
            </button>
          </div>
        </div>
        {/* Events */}
        <div className="custom-events d-flex flex-column align-items-center w-50 px-3 py-2">
          <h2>{translate("gameWaitingRoom.events.title")}</h2> {/* Use translation */}
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