import { ChangeEvent, useEffect, useState } from "react";
import "../styles/game-playing-room.css";
import images from "../cards/cards_importer";
import { Client, IMessage } from "@stomp/stompjs";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Card,
  MyCardsState,
  PlayersOrderState,
  PointState,
  TrumpSuitState,
  TurnState,
} from "../events/game-playing-room/WebSocketEventTypes";

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
  | TrumpSuitState;

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
  const [players, setPlayers] = useState<string[]>([]); // TODO DISPLAY COLORS OF PLAYER TEAMS
  const [redTeamPoints, setRedTeamPoints] = useState<number>(0);
  const [blueTeamPoints, setBlueTeamPoints] = useState<number>(0);
  const [cards, setCards] = useState<[bigint, string][]>([]);
  const [playerCardMapCurrentRound, setPlayerCardMapCurrentRound] = useState<
    // map of cards played by players in current round
    Map<string, string>
  >(new Map());
  const [suit, setSuit] = useState<string>("COINS"); // TODO wait until user selects trump and after that let him play his card (needed for user who chooses trump suit), because client.publish are asynchronous!
  const [displayTrumpSuitSelection, setDisplayTrumpSuitSelection] =
    useState(false);
  const [displayedSuit, setDisplayedSuit] = useState<string>("-");
  const [displayCallSelection, setDisplayCallSelection] = useState(false);

  // HELPER FUNCTIONS

  const findPlayerTeam = (username: string): string => {
    return gameContent.teams[0].indexOf(username) != -1 ? "RED" : "BLUE";
  };

  const doesUserHaveFourCoins = (cards: [bigint, string][]): boolean => {
    var result = cards.find((card) => card[1] === "/src/cards/Coins_FOUR.png");
    if (result === undefined) {
      return false;
    } else {
      return true;
    }
  };

  // it removes cards that were played last in last round
  const clearBoard = () => {
    setPlayerCardMapCurrentRound(new Map());
  };

  // WEBSOCKET FUNCTIONS

  const onMessageReceived = (msg: IMessage) => {
    console.log("MESSAGE RECEIVED, BODY:");
    console.log(msg.body);
    const events: WebSocketEventType[] = JSON.parse(msg.body);
    events.forEach((event) => {
      switch (event.eventType) {
        case "TurnState":
          handleTurnStateEvent(event.turn);
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
        default:
          console.warn("Unknown event type");
          break;
      }
    });
  };

  const handleTurnStateEvent = (playerCardMap: Map<string, Card>) => {
    var newPlayerCardMapCurrentRound: Map<string, string> = new Map(
      playerCardMapCurrentRound
    );
    Object.entries(playerCardMap).forEach(([playerName, card]) => {
      if (!newPlayerCardMapCurrentRound.has(playerName) && card !== null)
        newPlayerCardMapCurrentRound.set(
          playerName,
          convertCardIntoImageSrc(card)
        );
    });
    setPlayerCardMapCurrentRound(newPlayerCardMapCurrentRound);
  };

  const handleMyCardsStateEvent = (cards: Card[]) => {
    // TODO probably need changes in subscription to websocketevents
    const newCards: [bigint, string][] = [];
    cards.map((card) => {
      newCards.push([card.id, convertCardIntoImageSrc(card)]);
    });
    setCards(newCards);
  };

  const handlePointStateEvent = (playerPointsMap: Map<string, number>) => {
    var newRedTeamPoints = redTeamPoints;
    var newBlueTeamPoints = blueTeamPoints;
    Object.entries(playerPointsMap).forEach(([playerName, playerPoints]) => {
      console.log("playerName, playerPoints:", playerName, playerPoints);
      if (findPlayerTeam(playerName) === "RED") {
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

  // USE EFFECT FUNCTION

  useEffect(() => {
    // TODO don't pass teamRed and teamBlue as location state, use get request instead
    console.log(gameContent.teams);
    console.log(gameContent.gameId);
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
      }
    };

    const onError = (err: any) => {
      console.log("WebSocket connection error: " + err);
    };

    createWebSocketConnection();

    // get data of actual game

    const getPlayerCards = () => {
      axios
        .get<Card[]>(`${baseUrl}/gameplayer/${gameContent.gameId}/cards`)
        .then((response) => {
          var responseConvertedData: [bigint, string][] = response.data.map(
            (card) => {
              return [card.id, convertCardIntoImageSrc(card)];
            }
          );
          console.log(responseConvertedData);
          setCards(responseConvertedData);
          // check if user should select trump suit
          if (
            responseConvertedData.length === 10 &&
            doesUserHaveFourCoins(responseConvertedData)
          ) {
            setDisplayTrumpSuitSelection(true);
          }
        })
        .catch((error) => console.log(error));
    };

    const getPlayersOrder = () => {
      // TODO BACKEND - ORDER OF PLAYERS AT THE BEGINNING IS WRONG, CHECK WHEN IT IS SET
      axios
        .get<string[]>(`${baseUrl}/game/${gameContent.gameId}/players/order`)
        .then((response) => {
          setPlayers(response.data);
        })
        .catch((error) => {
          console.log("Error: " + error);
        });
    };

    const getGameState = () => {
      getPlayerCards();
      getPlayersOrder();
    };

    getGameState();

    return () => {
      if (client?.connected) client.deactivate();
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

  function handleSuitChange(event: ChangeEvent<HTMLSelectElement>): void {
    setSuit(event.target.value);
  }

  return (
    <>
      <div className="custom-outer-div d-flex flex-column justify-content-between p-2 min-vw-100 min-vh-100">
        {/* upper part */}
        <div className="d-flex">
          <div className="w-25">
            <button className="btn btn-danger fw-bold btn-lg rounded-0">
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
                      : "text-info"
                  }`}
                >
                  {player}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="d-flex flex-row align-items-center">
          {/* Cards played in current round section */}
          <div className="d-flex justify-content-center gap-4 w-50">
            {Array.from(playerCardMapCurrentRound).map(
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
                <p className="me-auto">
                  {gameContent.teams[0][0]} and {gameContent.teams[0][1]}:{" "}
                </p>
                <p className="ms-auto fs-5 fw-bold">{redTeamPoints}</p>
              </div>
              {/* points blue team */}
              <div className="d-flex flex-row align-items-center justify-content-end w-100 px-2">
                <p className="w-100">
                  {gameContent.teams[1][0]} and {gameContent.teams[1][1]}:{" "}
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
            {/* TODO handle call - player that is starting round can call sth (so we have to know who win previous turn) */}
            {/* Call select section */}
            <div className="w-25 mt-2">
              <p className="mb-2">Call</p>
              <select name="" className="form-select">
                <option value="">Knock</option>
                <option value="">Fly</option>
                <option value="">Slither</option>
                <option value="">Reslither</option>
              </select>
            </div>
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
                console.log("CARD PLAYED!");
                if (displayTrumpSuitSelection) {
                  console.warn("Yes, I was here!");
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
