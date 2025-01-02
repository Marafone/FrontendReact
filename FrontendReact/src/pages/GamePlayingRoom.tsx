import { Client, IMessage } from "@stomp/stompjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import images from "../cards/cards_importer";
import {
  Card,
  ErrorEvent,
  MyCardsState,
  NewRound,
  PlayersOrderState,
  PointState,
  TeamStateEvent,
  TrumpSuitState,
  TurnState,
  WinnerState,
} from "../events/game-playing-room/WebSocketEventTypes";
import "../styles/game-playing-room.css";
import axios from "axios";

var client: Client;

interface PlayingRoomContent {
  gameId: bigint;
  teams: [teamRed: string[], teamBlue: string[]];
}

type WebSocketEventType =
  | TurnState
  | MyCardsState
  | PointState
  | PlayersOrderState
  | TrumpSuitState
  | NewRound
  | WinnerState
  | ErrorEvent
  | TeamStateEvent;
// TODO, when user refresh page after turn is ended, he gets all the cards that were visible at the board, repair it
const convertCardIntoImageSrc = (card: Card): string => {
  var imageKey =
    card.suit.charAt(0).toUpperCase() +
    card.suit.slice(1).toLowerCase() +
    "_" +
    card.rank;
  return images[imageKey];
};

const GamePlayingRoom = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const gameContent: PlayingRoomContent = location.state;
  const [players, setPlayers] = useState<string[]>([]);
  const redTeamRef = useRef<string[]>([]);
  const [redTeamPoints, setRedTeamPoints] = useState<number>(0);
  const blueTeamRef = useRef<string[]>([]);
  const [blueTeamPoints, setBlueTeamPoints] = useState<number>(0);
  const [cards, setCards] = useState<[bigint, string][]>([]);
  const [playerCardMapCurrentTurn, setPlayerCardMapCurrentTurn] = useState<
    // map of cards played by players in current round
    Map<string, string | null>
  >(new Map());
  // trump suit part
  const [suit, setSuit] = useState<string>("COINS"); // TODO wait until user selects trump and after that let him play his card (needed for user who chooses trump suit), because client.publish are asynchronous!
  const [displayTrumpSuitSelection, setDisplayTrumpSuitSelection] =
    useState(false);
  const [displayedSuit, setDisplayedSuit] = useState<string>("-");
  // call part
  const [call, setCall] = useState<string>("KNOCK");
  const [displayCallSelection, setDisplayCallSelection] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // errors part
  const [errorModalMessage, setErrorModalMessage] = useState<string>();
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  // timer part
  const totalTime = 20;
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(totalTime);
  const [percentage, setPercentage] = useState<number>(100);
  // username part
  const usernameRef = useRef<string>();
  // result of the game modal
  const [showResultModal, setShowResultModal] = useState(false);
  const [winnerTeam, setWinnerTeam] = useState<string>("");

  // HELPER FUNCTIONS

  const findPlayerTeam = (username: string): string => {
    return redTeamRef.current.includes(username) ? "RED" : "BLUE";
  };

  const doesUserHaveFourCoins = (cards: [bigint, string][]): boolean => {
    var result = cards.find((card) => card[1] === "/src/cards/Coins_FOUR.png");
    if (result === undefined) {
      return false;
    } else {
      return true;
    }
  };

  const onTimeUp = () => {
    if (!isTimerRunning) return;
    console.log("I am sending request to check timeout");
    client.publish({
      destination: `/app/game/${gameContent.gameId}/timeout`,
    });
    // set values of variables responsible for timeout management
    setIsTimerRunning(false);
  };

  // it removes cards that were played in last turn
  const clearBoard = () => {
    const newMap = new Map<string, string | null>();
    players.forEach((player) => newMap.set(player, null));
    setPlayerCardMapCurrentTurn(newMap);
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setTimeLeft(totalTime);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(0);
  };

  const capitalizeWord = (word: string): string | null => {
    if (!word) return null;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  // WEBSOCKET FUNCTIONS

  const onMessageReceived = (msg: IMessage) => {
    // console.log("MESSAGE RECEIVED, BODY:");
    // console.log(msg.body);
    const events: WebSocketEventType[] = JSON.parse(msg.body);
    events.forEach((event) => {
      switch (event.eventType) {
        case "TurnState":
          handleStopTimer();
          handleTurnStateEvent(event.turn);
          handleStartTimer();
          break;
        case "MyCardsState":
          handleMyCardsStateEvent(event.myCards);
          break;
        case "PointState":
          handlePointStateEvent(event.playerPointState);
          clearBoard();
          break;
        case "PlayersOrderState":
          handlePlayersOrderStateEvent(event.playersOrder);
          break;
        case "TrumpSuitState":
          handleTrumpSuitStateEvent(event.trumpSuit);
          break;
        case "NewRound":
          handleNewRoundEvent();
          break;
        case "WinnerState":
          handleWinnerStateEvent(event.winnerTeam);
          break;
        case "ErrorEvent":
          handleErrorEvent(event.errorMessage);
          break;
        case "TeamState":
          handleTeamStateEvent(event.redTeam, event.blueTeam);
          break;
        default:
          console.warn("Unknown event type");
          break;
      }
    });
  };

  const handleTurnStateEvent = (playerCardMap: Map<string, Card>) => {
    var newPlayerCardMapCurrentTurn: Map<string, string> = new Map();
    Object.entries(playerCardMap).forEach(([playerName, card]) => {
      if (card !== null)
        newPlayerCardMapCurrentTurn.set(
          playerName,
          convertCardIntoImageSrc(card)
        );
    });
    setPlayerCardMapCurrentTurn(newPlayerCardMapCurrentTurn);
  };

  const handleMyCardsStateEvent = (cards: Card[]) => {
    const newCards: [bigint, string][] = [];
    cards.map((card) => {
      newCards.push([card.id, convertCardIntoImageSrc(card)]);
    });
    if (newCards.length === 10 && doesUserHaveFourCoins(newCards))
      setDisplayTrumpSuitSelection(true);
    setCards(newCards);
  };

  const handlePointStateEvent = (playerPointsMap: Map<string, number>) => {
    var newRedTeamPoints = 0;
    var newBlueTeamPoints = 0;
    Object.entries(playerPointsMap).forEach(([playerName, playerPoints]) => {
      if (findPlayerTeam(playerName) == "RED") {
        newRedTeamPoints += playerPoints;
      } else {
        newBlueTeamPoints += playerPoints;
      }
    });
    setRedTeamPoints(newRedTeamPoints);
    setBlueTeamPoints(newBlueTeamPoints);
  };

  const handlePlayersOrderStateEvent = (playersOrder: string[]) => {
    setPlayers(playersOrder);
  };

  const handleTrumpSuitStateEvent = (trumpSuit: string) => {
    setDisplayedSuit(trumpSuit);
  };

  const handleNewRoundEvent = () => {
    // TODO is it necessary event?
    // setPlayerCardMapCurrentTurn(new Map());
    // setRedTeamPoints(0);
    // setBlueTeamPoints(0);
  };

  const handleWinnerStateEvent = (team: string) => {
    setWinnerTeam(team);
    setShowResultModal(true);
  };

  const handleErrorEvent = (errorMessage: string) => {
    setErrorModalMessage(errorMessage);
    setShowErrorModal(true);
  };

  const handleTeamStateEvent = (redTeam: string[], blueTeam: string[]) => {
    redTeamRef.current = redTeam;
    blueTeamRef.current = blueTeam;
  };

  // USE EFFECT HOOKS

  useEffect(() => {
    if (client?.connected) {
      client.deactivate(); // if connection still remains after previous connection
    }

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
      if (client?.connected) client.deactivate();
    };
  }, []);

  // user data hook

  useEffect(() => {
    axios
      .get(`${baseUrl}/user/info`)
      .then((response) => {
        usernameRef.current = response.data.username;
      })
      .catch((error) => console.log(error));
  }, []);

  // time use effect

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isTimerRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    setPercentage((timeLeft / totalTime) * 100);
  }, [timeLeft, totalTime]);

  useEffect(() => {
    if (redTeamRef.current.length > 0 && blueTeamRef.current.length > 0)
      setLoading(false);
    else setLoading(true);
  }, [redTeamRef.current, blueTeamRef.current]);

  // error modal use effect

  const errorModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideErrorModalClick = (event: MouseEvent) => {
      if (
        errorModalRef.current &&
        !errorModalRef.current.contains(event.target as Node)
      ) {
        setShowErrorModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideErrorModalClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideErrorModalClick);
    };
  }, []);

  // call modal use effect

  const callModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideCallModalClick = (event: MouseEvent) => {
      if (
        callModalRef.current &&
        !callModalRef.current.contains(event.target as Node)
      ) {
        setShowCallModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideCallModalClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideCallModalClick);
    };
  }, []);

  // WIDGET FUNCTIONS

  function handleSelectCard(id: bigint): void {
    client.publish({
      destination: `/app/game/${gameContent.gameId}/card`,
      body: JSON.stringify({ cardId: id }),
    });
  }

  function handleSelectSuit(suit: string) {
    client.publish({
      destination: `/app/game/${gameContent.gameId}/suit`,
      body: JSON.stringify({ trumpSuit: suit }),
    });
  }

  const handleSuitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSuit(event.target.value);
  };

  const handleCallChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCall(event.target.value);
  };

  const navigate = useNavigate();

  const handleQuitGame = () => {
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <p className="fs-4 fw-bold">Loading game data...</p>
      </div>
    );
  }
  return (
    <>
      {/* place for error modal */}
      <div className={`modal fade ${showErrorModal ? "show d-block" : ""}`}>
        <div className="modal-dialog modal-md mt-5" ref={errorModalRef}>
          <div className="modal-content bg-danger">
            <div className="modal-header border-black">
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowErrorModal(false)}
              ></button>
            </div>
            <div className="modal-body fw-bold">{errorModalMessage}</div>
          </div>
        </div>
      </div>
      {/* place for call modal */}
      <div className={`modal fade ${showCallModal ? "show d-block" : ""}`}>
        <div className="modal-dialog modal-sm mt-5" ref={callModalRef}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Call</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCallModal(false)}
              ></button>
            </div>
            <div className="modal-body text-center fw-bold">{call}</div>
          </div>
        </div>
      </div>
      {/* place for result modal */}
      <div
        className={`modal bg-dark bg-opacity-25 align-items-center fade ${
          showResultModal ? "show d-block" : ""
        }`}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-4">Result</h1>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowResultModal(false)}
              ></button>
            </div>
            <div className="modal-body text-center">
              <p
                className={`fw-bold mt-3 ${
                  winnerTeam === "RED" ? "text-danger" : "text-primary"
                }`}
              >
                {capitalizeWord(winnerTeam)} team won!
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleQuitGame}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main page content */}
      <div className="custom-outer-div d-flex flex-column justify-content-between p-2 min-vw-100 min-vh-100">
        {/* upper part */}
        <div className="d-flex">
          <div className="w-25">
            <button
              className="btn btn-danger fw-bold btn-lg rounded-0"
              onClick={handleQuitGame}
            >
              Exit
            </button>
          </div>
          <div className="d-flex justify-content-start align-items-center w-75 text-center">
            <ul className="d-flex list-unstyled gap-5 fs-5 fw-bold m-0 ms-5">
              {players.map((player) => (
                <li
                  key={player}
                  className={`${
                    findPlayerTeam(player) === "RED"
                      ? "text-danger"
                      : "text-primary"
                  }`}
                >
                  {player}
                </li>
              ))}
            </ul>
          </div>
          {/* timeout bar */}
          {isTimerRunning && (
            <div className="d-flex align-items-center w-25">
              <div
                className="d-flex bg-primary ms-auto border border-black border-3 h-50"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="d-flex flex-row align-items-center">
          {/* Cards played in current round section */}
          <div className="d-flex justify-content-center gap-4 w-50">
            {Array.from(playerCardMapCurrentTurn).map(
              ([playerName, src]) =>
                src && (
                  <div className="text-center" key={playerName}>
                    <p className="fw-bold fs-5">{playerName}</p>
                    <img className="custom-img" src={src} />
                  </div>
                )
            )}
          </div>
          {/* Points and other options */}
          <div className="d-flex flex-column w-50 align-items-center">
            {/* Points section */}
            <div className="d-flex flex-column align-items-center w-25 bg-white rounded-4 p-2">
              <p className="fw-bold fs-4">Points</p>
              {/* points red team */}
              <div className="d-flex flex-row align-items-center justify-content-end w-100 px-2">
                <p className="me-auto text-danger fw-bold">
                  {redTeamRef.current[0]}{" "}
                  <span className="text-black fw-normal">and</span>{" "}
                  {redTeamRef.current[1]}:{" "}
                </p>
                <p className="ms-auto fs-5 fw-bold">{redTeamPoints}</p>
              </div>
              {/* points blue team */}
              <div className="d-flex flex-row align-items-center justify-content-end w-100 px-2">
                <p className="w-100 text-primary fw-bold">
                  {blueTeamRef.current[0]}{" "}
                  <span className="text-black fw-normal">and</span>{" "}
                  {blueTeamRef.current[1]}:{" "}
                </p>
                <p className="ms-auto fs-5 fw-bold">{blueTeamPoints}</p>
              </div>
              {/* Trump Suit display section */}
              <p className="fw-bold fs-4 mt-3">Trump Suit</p>
              <p className="fw-bold">{displayedSuit}</p>
            </div>
            {/* Trump Suit select section */}
            {displayTrumpSuitSelection && (
              <div className="w-25 mt-2">
                <p className="mb-2">Trump suit</p>
                <select
                  className="form-select"
                  value={suit}
                  onChange={handleSuitChange}
                >
                  <option value="COINS">Coins</option>
                  <option value="CUPS">Cups</option>
                  <option value="CLUBS">Clubs</option>
                  <option value="SWORDS">Swords</option>
                </select>
              </div>
            )}
            {/* Call select section */}
            {displayCallSelection && (
              <div className="w-25 mt-2">
                <p className="mb-2">Call</p>
                <select
                  className="form-select"
                  value={call}
                  onChange={handleCallChange}
                >
                  <option value="KNOCK">Knock</option>
                  <option value="FLY">Fly</option>
                  <option value="SLITHER">Slither</option>
                  <option value="RESLITHER">Reslither</option>
                </select>
              </div>
            )}
          </div>
        </div>
        {/* Cards */}
        <div className="d-flex flex-wrap gap-2 custom-cards-container">
          {cards.map(([id, src]) => (
            <img
              key={id}
              src={src}
              className="custom-img"
              onClick={() => {
                if (displayTrumpSuitSelection) {
                  handleSelectSuit(suit);
                  setDisplayTrumpSuitSelection(false);
                }
                handleSelectCard(id);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GamePlayingRoom;
