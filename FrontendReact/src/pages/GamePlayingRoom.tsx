import { useEffect, useState } from "react";
import "../styles/game-playing-room.css";
import images from "../cards/cards_importer";
import { Client, IMessage } from "@stomp/stompjs";
import { useLocation } from "react-router-dom";
import axios from "axios";

var client: Client;

interface PlayingRoomContent {
  gameId: bigint;
}

interface Card {
  id: bigint;
  rank: string;
  suit: string;
}

const GamePlayingRoom = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const gameContent: PlayingRoomContent = location.state;
  const [players, setPlayers] = useState<string[]>([
    "Fabrizio",
    "Luca",
    "Gianluigi",
    "Pino",
  ]);
  const [redTeamPoints, setRedTeamPoints] = useState<number>(0);
  const [blueTeamPoints, setBlueTeamPoints] = useState<number>(0);
  const [cards, setCards] = useState<string[]>([]);

  const onMessageReceived = (msg: IMessage) => {
    console.log("message received: ", msg);
  };

  useEffect(() => {
    if (client?.connected) {
      client.deactivate(); // if connection still remains after previous connection
    }

    const createWebSocketConnection = () => {
      client = new Client({
        brokerURL: `${baseUrl}/game`,
        debug: (str) => console.log(str),
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
        client.subscribe(`/user/queue/game/`, onMessageReceived);
        console.log("Connection established!");
      } else {
        console.log("STOMP Client is not connected yet!!");
      }
    };

    const onError = (err: any) => {
      console.log("WebSocket connection error: " + err);
    };

    createWebSocketConnection();

    // get data of actual game

    const getGameState = () => {
      axios
        .get<Card[]>(`${baseUrl}/gameplayer/${gameContent.gameId}/cards`)
        .then((response) => {
          var responseConvertedData = response.data.map((card) => {
            var imageKey =
              card.suit.charAt(0).toUpperCase() +
              card.suit.slice(1).toLowerCase() +
              "_" +
              card.rank;
            return images[imageKey];
          });
          setCards(responseConvertedData);
        })
        .catch((error) => console.log(error));
    };

    getGameState();

    return () => {
      if (client?.connected) client.deactivate();
    };
  }, []);

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
                <li key={player} className="">
                  {player}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Points and other options */}
        <div className="d-flex flex-column w-25 ms-auto">
          <div className="d-flex flex-column align-items-center w-50 bg-white rounded-4 p-2">
            <p className="fw-bold fs-4">Points</p>
            {/* points red team */}
            <div className="d-flex flex-row align-items-center justify-content-end w-100 px-2">
              <p className="me-auto">
                {players[0]} and {players[2]}:{" "}
              </p>
              <p className="ms-auto fs-5 fw-bold">{redTeamPoints}</p>
            </div>
            {/* points blue team */}
            <div className="d-flex flex-row align-items-center justify-content-end w-100 px-2">
              <p className="w-100">
                {players[1]} and {players[3]}:{" "}
              </p>
              <p className="ms-auto fs-5 fw-bold">{blueTeamPoints}</p>
            </div>
            {/* Trump Suit */}
            <p className="fw-bold fs-4 mt-3">Trump Suit</p>
            <p className="fw-bold">-</p>
          </div>
          <div className="w-50 mt-2">
            <p className="mb-2">Trump suit</p>
            <select name="" className="form-select">
              <option value="">Coins</option>
              <option value="">Cups</option>
              <option value="">Sticks</option>
              <option value="">Swords</option>
            </select>
          </div>
          <div className="w-50 mt-2">
            <p className="mb-2">Call</p>
            <select name="" className="form-select">
              <option value="">Knock</option>
              <option value="">Fly</option>
              <option value="">Slither</option>
              <option value="">Reslither</option>
            </select>
          </div>
        </div>
        {/* Cards */}
        <div className="d-flex flex-wrap gap-2 custom-cards-container">
          {cards.map((card) => (
            <img key={card} src={card} className="custom-img" />
          ))}
        </div>
      </div>
    </>
  );
};

export default GamePlayingRoom;
