import { Client, IMessage } from "@stomp/stompjs";
import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import images from "../cards/cards_importer";
import CallModal from "../components/CallModal";
import ErrorModal from "../components/ErrorModal";
import {
  Call,
  CallState,
  Card,
  ErrorEvent,
  MyCardsState,
  NewRound,
  NewTurn,
  NextPlayerState,
  PlayersOrderState,
  PointState,
  TeamStateEvent,
  TrumpSuitState,
  TurnState,
  WinnerState,
} from "../events/game-playing-room/WebSocketEventTypes";
import "../styles/game-playing-room.css";
import ResultModal from "../components/ResultModal";

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
  | NewTurn
  | NewRound
  | WinnerState
  | ErrorEvent
  | TeamStateEvent
  | NextPlayerState
  | CallState;

const convertCardIntoImageSrc = (card: Card | null): string | null => {
  if (card == null) return null;
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
  const [redTeamPoints, setRedTeamPoints] = useState<string>("");
  const blueTeamRef = useRef<string[]>([]);
  const [blueTeamPoints, setBlueTeamPoints] = useState<string>("");
  const [cards, setCards] = useState<[bigint, string][]>([]);
  const [playerCardMapCurrentTurn, setPlayerCardMapCurrentTurn] = useState<
    // map of cards played by players in current round
    Map<string, string | null>
  >(new Map());
  const [loading, setLoading] = useState(true);
  // trump suit part
  const [suit, setSuit] = useState<string>("COINS"); // TODO wait until user selects trump and after that let him play his card (needed for user who chooses trump suit), because client.publish are asynchronous!
  const [displayTrumpSuitSelection, setDisplayTrumpSuitSelection] =
    useState(false);
  const [displayedSuit, setDisplayedSuit] = useState<string>("-");
  // call part
  const [call, setCall] = useState<string>("");
  const [displayCallSelection, setDisplayCallSelection] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  // errors part
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");
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
  // cards played last turn part
  const [playerCardMapLastTurn, setPlayerCardMapLastTurn] = useState<
    Map<string, string | null>
  >(new Map()); // username -> played card
  const [isPlayerCardMapLastTurnVisible, setIsPlayerCardMapLastTurnVisible] =
    useState(true);
  // timer to let cards be on board for a while before new round starts
  const paused = useRef(false);

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
    client.publish({
      destination: `/app/game/${gameContent.gameId}/timeout`,
    });
    // set values of variables responsible for timeout management
    setIsTimerRunning(false);
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

  async function waitUntilResumed() {
    return new Promise((resolve: Function) => {
      const intervalId = setInterval(() => {
        if (!paused.current) {
          clearInterval(intervalId);
          resolve();
        }
      }, 334);
    });
  }

  const convertToFraction = (value: number) => {
    const epsilon = 1e-6;
    const fractions = [
      { value: 0, fraction: "0" },
      { value: 1 / 3, fraction: "¹/₃" },
      { value: 2 / 3, fraction: "²/₃" },
    ];

    for (const fraction of fractions) {
      if (Math.abs(value - fraction.value) < epsilon) return fraction.fraction;
    }

    throw new Error("Value does not match expected fractions");
  };

  // WEBSOCKET FUNCTIONS

  const handleTurnStateEvent = (playerCardMap: Map<string, Card>) => {
    setPlayerCardMapCurrentTurn((prevMap) => {
      // go through each player in playerCardMap from the event
      Object.entries(playerCardMap).forEach(([playerName, card]) => {
        prevMap.set(playerName, convertCardIntoImageSrc(card));
      });
      // return new version of prev map
      return prevMap;
    });
  };

  const handleMyCardsStateEvent = (cards: Card[]) => {
    const clubsCards: [bigint, string][] = [];
    const coinsCards: [bigint, string][] = [];
    const cupsCards: [bigint, string][] = [];
    const swordsCards: [bigint, string][] = [];
    cards.map((card) => {
      const valueToAdd: [bigint, string] = [
        card.id,
        convertCardIntoImageSrc(card) ?? "",
      ];
      switch (card.suit) {
        case "CLUBS":
          clubsCards.push(valueToAdd);
          break;
        case "CUPS":
          cupsCards.push(valueToAdd);
          break;
        case "SWORDS":
          swordsCards.push(valueToAdd);
          break;
        case "COINS":
          coinsCards.push(valueToAdd);
          break;
      }
    });
    const newCards: [bigint, string][] = clubsCards
      .concat(coinsCards)
      .concat(cupsCards)
      .concat(swordsCards);
    if (newCards.length === 10 && doesUserHaveFourCoins(newCards)) {
      setDisplayCallSelection(true);
      setDisplayTrumpSuitSelection(true);
    }
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
    newRedTeamPoints = Number(newRedTeamPoints / 3);
    newBlueTeamPoints = Number(newBlueTeamPoints / 3);
    // find what is a fraction (no fraction, 1/3 or 2/3)
    var redTeamFraction: string = convertToFraction(
      newRedTeamPoints - Math.floor(newRedTeamPoints)
    );
    var blueTeamFraction: string = convertToFraction(
      newBlueTeamPoints - Math.floor(newBlueTeamPoints)
    );
    // we want to display integer part with fraction part
    var redTeamInteger: string = Math.floor(newRedTeamPoints).toString();
    var blueTeamInteger: string = Math.floor(newBlueTeamPoints).toString();

    if (redTeamFraction == "0") setRedTeamPoints(redTeamInteger);
    else if (redTeamInteger == "0") setRedTeamPoints(redTeamFraction);
    else setRedTeamPoints(redTeamInteger + redTeamFraction);

    if (blueTeamFraction == "0") setBlueTeamPoints(blueTeamInteger);
    else if (blueTeamInteger == "0") setBlueTeamPoints(blueTeamFraction);
    else setBlueTeamPoints(blueTeamInteger + blueTeamFraction);
  };

  const handlePlayersOrderStateEvent = (playersOrder: string[]) => {
    setPlayers(playersOrder);
    // set map to display the cards on the board in the correct order
    const newMap = new Map();
    playersOrder.forEach((player) => {
      newMap.set(player, null);
    });
    setPlayerCardMapCurrentTurn(newMap);
  };

  const handleTrumpSuitStateEvent = (trumpSuit: string) => {
    setDisplayedSuit(trumpSuit);
    if (trumpSuit != null)
      // if trump suit was already selected, do not display trump suit selection option
      setDisplayTrumpSuitSelection(false);
  };

  const handleNewTurnEvent = () => {
    paused.current = true;
    setTimeout(() => {
      // clear board and move all the cards played in this turn to proper map
      setPlayerCardMapCurrentTurn((prevMap) => {
        setPlayerCardMapLastTurn(prevMap);
        return new Map();
      });
      paused.current = false;
    }, 1000);
  };

  const handleNewRoundEvent = (firstPlayerName: string) => {
    // reset timer
    handleStopTimer();
    handleStartTimer();

    // clear board and move cards to last turn cards section
    handleNewTurnEvent();

    // handle suit and call
    setDisplayedSuit("None");
    if (usernameRef.current == firstPlayerName) {
      setSuit("COINS");
      setDisplayTrumpSuitSelection(true);
      setDisplayCallSelection(true);
    } else {
      setDisplayTrumpSuitSelection(false);
      setDisplayCallSelection(false);
    }
  };

  const handleWinnerStateEvent = (team: string) => {
    handleStopTimer();
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

  const handleNextPlayerStateEvent = (
    playerName: string,
    isFirstPlayer: boolean
  ) => {
    if (usernameRef.current === playerName && isFirstPlayer)
      setDisplayCallSelection(true);
    else setDisplayCallSelection(false);
    handleStopTimer();
    handleStartTimer();
  };

  const handleCallStateEvent = (call: Call) => {
    setCall(call);
    setShowCallModal(true);
  };

  const onMessageReceived = async (msg: IMessage) => {
    const events: WebSocketEventType[] = JSON.parse(msg.body);

    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      if (paused.current) await waitUntilResumed();

      switch (event.eventType) {
        case "TurnState":
          handleTurnStateEvent(event.turn);
          break;
        case "MyCardsState":
          handleMyCardsStateEvent(event.myCards);
          break;
        case "PointState":
          handlePointStateEvent(event.playerPointState);
          break;
        case "PlayersOrderState":
          handlePlayersOrderStateEvent(event.playersOrder);
          break;
        case "TrumpSuitState":
          handleTrumpSuitStateEvent(event.trumpSuit);
          break;
        case "NewTurn":
          handleNewTurnEvent();
          break;
        case "NewRound":
          handleNewRoundEvent(event.firstPlayerName);
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
        case "NextPlayerState":
          handleNextPlayerStateEvent(event.playerName, event.isFirstPlayer);
          break;
        case "CallState":
          handleCallStateEvent(event.call);
          break;
        default:
          console.warn("Unknown event type");
          break;
      }
    }
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

  // WIDGET FUNCTIONS

  const handleSelectCard = (id: bigint) => {
    client.publish({
      destination: `/app/game/${gameContent.gameId}/card`,
      body: JSON.stringify({ cardId: id }),
    });
  };

  const handleSelectSuit = (suit: string) => {
    client.publish({
      destination: `/app/game/${gameContent.gameId}/suit`,
      body: JSON.stringify({ trumpSuit: suit }),
    });
  };

  const handleSelectCall = (call: string) => {
    if (call == "")
      // empty call means that user does not want to make a call
      return;
    client.publish({
      destination: `/app/game/${gameContent.gameId}/call`,
      body: JSON.stringify(call),
    });
  };

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

  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(true);

  const toggleOptionsVisibility = () => {
    setIsOptionsVisible((prev) => !prev);
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
      {/* Error Modal */}
      {showErrorModal && (
        <ErrorModal
          message={errorModalMessage}
          onClose={() => {
            setShowErrorModal(false);
            setErrorModalMessage("");
          }}
        />
      )}
      {/* Call Modal */}
      {showCallModal && (
        <CallModal
          title={players[0] + " call"}
          message={call}
          onClose={() => {
            setShowCallModal(false);
            setCall("");
          }}
        />
      )}
      {/* place for result modal */}
      {showResultModal && (
        <ResultModal
          title="Game Over"
          message={`${capitalizeWord(winnerTeam)} team won!`}
          winnerTeam={winnerTeam}
          onClose={handleQuitGame}
        />
      )}

      {/* Main page content */}
      <div className="custom-outer-div d-flex flex-column justify-content-between p-2 min-vw-100 min-vh-100">
        {/* upper part */}
        <div className="d-flex custom-upper-part">
          <div className="custom-exit-container">
            <button
              className="btn btn-danger fw-bold custom-exit-button"
              onClick={handleQuitGame}
            >
              Exit
            </button>
          </div>
          <div className="d-flex justify-content-start align-items-center custom-players-container">
            <ul className="d-flex list-unstyled custom-players-list">
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
                className="d-flex bg-primary ms-auto border border-black border-3 h-50 mt-3"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          className="btn btn-primary position-fixed"
          style={{
            top: "60%",
            left: "10px",
            transform: "translateY(-50%)",
            zIndex: 1050,
          }}
          onClick={() =>
            setIsPlayerCardMapLastTurnVisible(!isPlayerCardMapLastTurnVisible)
          }
        >
          {isPlayerCardMapLastTurnVisible ? "Hide" : "Show"}
        </button>

        {/* Cards Played In Last Turn */}
        <div
          className={`last-turn-cards-container d-flex flex-column justify-content-start align-items-center w-25 bg-white p-3 ${
            isPlayerCardMapLastTurnVisible ? "visible" : "hidden"
          }`}
        >
          <p className="fs-5 fw-bold">Last Turn Cards</p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {Array.from(playerCardMapLastTurn).map(
              ([playerName, src]) =>
                src && (
                  <div className="text-center" key={playerName}>
                    <p className="fw-semibold mb-0">{playerName}</p>
                    <img className="last-turn-img" src={src} />
                  </div>
                )
            )}
          </div>
        </div>

        {/* Center Cards Section */}
        <div className="d-flex justify-contents-center align-items-center">
          <div className="custom-center-cards">
            {Array.from(playerCardMapCurrentTurn).map(
              ([playerName, src], index) =>
                src && (
                  <div
                    className="text-center custom-card"
                    key={playerName + index}
                  >
                    <p className="fw-bold fs-5">{playerName}</p>
                    <img
                      className="custom-img"
                      src={src}
                      alt={`${playerName}'s card`}
                    />
                  </div>
                )
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          className="btn btn-primary position-fixed"
          style={{
            top: "60%",
            right: "10px",
            transform: "translateY(-50%)",
            zIndex: 1050,
          }}
          onClick={toggleOptionsVisibility}
        >
          {isOptionsVisible ? "Hide" : "Show"}
        </button>

        {/* Points and other options */}
        <div
          className={`options-container ${
            isOptionsVisible ? "visible" : "hidden"
          }`}
        >
          <div className="d-flex flex-column align-items-center bg-white rounded-4 p-2">
            <p className="fw-bold fs-4">Points</p>
            <div className="d-flex flex-row align-items-center justify-content-end w-100 px-2">
              <p className="me-auto text-danger fw-bold">
                {redTeamRef.current[0]}{" "}
                <span className="text-black fw-normal">and</span>{" "}
                {redTeamRef.current[1]}:{" "}
              </p>
              <p className="ms-auto fs-4 fw-bold">{redTeamPoints}</p>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-end w-100 px-2">
              <p className="me-auto text-primary fw-bold">
                {blueTeamRef.current[0]}{" "}
                <span className="text-black fw-normal">and</span>{" "}
                {blueTeamRef.current[1]}:{" "}
              </p>
              <p className="ms-auto fs-4 fw-bold">{blueTeamPoints}</p>
            </div>
            <p className="fw-bold fs-4 mt-3">Trump Suit</p>
            <p className="fw-bold">{displayedSuit || "None"}</p>
            {displayTrumpSuitSelection && (
              <div className="mt-2">
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
              <div className="mt-2">
                <p className="mb-2">Call</p>
                <select
                  className="form-select"
                  value={call}
                  onChange={handleCallChange}
                >
                  <option value="">None</option>
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
                }
                handleSelectCard(id);
                if (displayCallSelection) {
                  handleSelectCall(call);
                  setDisplayCallSelection(false);
                }
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GamePlayingRoom;
