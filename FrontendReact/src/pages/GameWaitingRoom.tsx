import {Client, IFrame, IMessage} from "@stomp/stompjs";
import axiosWithLogout from "../axios";
import {useContext, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {
    ErrorEvent,
    GameStartedEvent,
    OwnerEvent,
    PlayerJoinedEvent,
    PlayerLeftEvent,
    TeamStateEvent,
} from "../events/game-waiting-room/WebSocketEventTypes";
import "../styles/game-waiting-room.css";
import {LanguageContext} from "../context/LanguageContext";
import {useTheme} from "../context/ThemeContext";
import {playSound} from "../soundEffects";
import {toast} from 'react-toastify';
import {GameData} from "../types/game.ts";
import axios from "axios";
import GameCodeModal from "../components/GameCodeModal.tsx";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

type WebSocketEventType =
    | TeamStateEvent
    | PlayerJoinedEvent
    | PlayerLeftEvent
    | GameStartedEvent
    | ErrorEvent
    | OwnerEvent;

const GameWaitingRoom = () => {

    // Use the LanguageContext
    const {translate} = useContext(LanguageContext)!;

    const maxPlayersAmount = 4;
    const location = useLocation();
    const gameData = location.state as GameData;
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

    const clientRef = useRef<Client | null>(null);

    const [loading, setLoading] = useState(false);

    const [showGameCodeModal, setShowGameCodeModal] = useState(false);
    const [showGameCodeButton, setShowGameCodeButton] = useState(false);

    // HELPER FUNCTIONS

    const handleClientUnsubscribe = () => {
        if (clientRef.current?.connected) {
            try {
                clientRef.current.unsubscribe(`/topic/game/${gameData.gameId}`);
                clientRef.current.unsubscribe(`/user/queue/game`);
            } catch (e) {
                console.log("error when trying to unsubscribe: ", e);
            } finally {
                clientRef.current.deactivate();
            }
        }
    }

    const handleStartGame = () => {
        clientRef.current?.publish({destination: `/app/game/${gameData.gameId}/start`});
    };

    const handleLeaveGame = () => {
        handleClientUnsubscribe();

        axiosWithLogout
            .post(`/game/${gameData.gameId}/leave`)
            .then(() => {
                navigate("/", {replace: true});
            });
        playSound("/sounds/ui-leave.mp3");
    };

    const handleChangeTeam = (team: string) => {
        axiosWithLogout
            .post(`/game/${gameData.gameId}/team/change`, team, {
                headers: {
                    "Content-Type": "text/plain",
                },
            });
    };

    const handleAddAI = (team: string) => {
        axiosWithLogout
            .post(`/game/${gameData.gameId}/add-ai`, team, {
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
            state: {gameId: gameData.gameId},
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
        if (username === newOwnerName)
            setShowGameCodeButton(true);
        if (!isNew) return;
        toast.info(`${newOwnerName} ${translate("gameWaitingRoom.info.newOwnerMessageSuffix")}`)
    };

    // USE EFFECT HOOK

    useEffect(() => {
        const createWebSocketConnection = () => {
            setLoading(true);
            const client = new Client({
                brokerURL: `${import.meta.env.VITE_API_BASE_URL}/game`,
                // debug: (str) => console.log(str),
                onConnect: onConnected,
                onStompError: onError,
            });

            client.activate();
            clientRef.current = client;
        };

        const onConnected = () => {
            if (clientRef.current?.connected) {
                clientRef.current.subscribe(
                    `/topic/game/${gameData.gameId}`,
                    onMessageReceived
                );
                clientRef.current.subscribe(`/user/queue/game`, onMessageReceived);
                clientRef.current.publish({
                    destination: `/app/game/${gameData.gameId}/reconnect`,
                });
            }
            setLoading(false);
        };

        const onError = (frame: IFrame) => {
            console.log("Broker error: ", frame.headers['message'])
            console.log("Details: ", frame.body);
        };

        createWebSocketConnection();

        return () => handleClientUnsubscribe();
    }, []);

    // user data hook

    useEffect(() => {
        axiosWithLogout
            .get(`/user/info`)
            .then((response) => {
                setUsername(response.data.username);
            });
    }, []);

    // dark mode effect

    const {theme} = useTheme();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <>
            {showGameCodeModal &&
                <GameCodeModal gameCode={gameData.gameId} onHide={() => setShowGameCodeModal(false)}/>}
                <div
                    className="main-container d-flex flex-column justify-content-evenly align-items-center min-vh-100 min-vw-100"
                >
                    {/* Lobby */}
                    <div className="custom-lobby w-75 p-3">
                        {/* header */}
                        <div>
                            <div className="d-flex flex-row justify-content-between align-items-center px-3 py-2">
                                <h2>{gameData.gameName}</h2>
                                <div>
                                    {showGameCodeButton && <button className="btn btn-success fw-bold me-1"
                                                                   onClick={() => setShowGameCodeModal(true)}>
                                        {translate("gameWaitingRoom.buttons.getGameCode")}
                                    </button>}
                                    <button
                                        className="btn btn-danger fw-bold"
                                        onClick={handleLeaveGame}
                                    >
                                        {translate("gameWaitingRoom.buttons.exit")}
                                    </button>
                                </div>
                            </div>
                            <hr className="border border-black border-2 opacity-50 mt-0 mx-3"/>
                        </div>
                        {/* teams */}
                        <div className="d-flex justify-content-evenly">
                            <div className="d-flex flex-column align-items-center">
                                <button
                                    className="btn btn-danger fw-bold mb-4"
                                    onClick={() => handleChangeTeam("RED")}
                                >
                                    {translate("gameWaitingRoom.buttons.redTeam")}
                                </button>
                                {/* Add AI to Red Team */}
                                <button
                                    className="btn fw-bold text-danger mb-2"
                                    onClick={() => handleAddAI("RED")}
                                >
                                    <i className="bi bi-pc-display-horizontal rounded me-1"/>
                                    {translate("gameWaitingRoom.buttons.addAI")}
                                </button>
                                {loading && <p>Loading Data...</p>}
                                {teamRed.map((player) => (
                                    <p
                                        key={player}
                                        className={`custom-player text-danger px-3 py-1 rounded-4 ${
                                            username === player ? "fw-bold" : ""
                                        }`}
                                    >
                                        {player == ownerName && (
                                            <i className="bi bi-person-badge px-1"/>
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
                                    {translate("gameWaitingRoom.buttons.blueTeam")}
                                </button>
                                {/* Add AI to Blue Team */}
                                <button
                                    className="btn fw-bold text-primary mb-2"
                                    onClick={() => handleAddAI("BLUE")}
                                >
                                    <i className="bi bi-pc-display-horizontal me-1"/>
                                    {translate("gameWaitingRoom.buttons.addAI")}
                                </button>
                                {loading && <p>Loading Data...</p>}
                                {teamBlue.map((player) => (
                                    <p
                                        key={player}
                                        className={`custom-player text-primary px-3 py-1 rounded-4 ${
                                            username === player ? "fw-bold" : ""
                                        }`}
                                    >
                                        {player == ownerName && (
                                            <i className="bi bi-person-badge px-1"/>
                                        )}
                                        {player}
                                    </p>
                                ))}
                            </div>
                        </div>
                        {/* game info */}
                        <div className="d-flex flex-column align-items-center mt-3">
                            <p>
                            <span
                                className="fw-bold">{translate("gameWaitingRoom.labels.gameType")}: </span>
                                {gameData.gameType}
                            </p>
                            <p>
                            <span
                                className="fw-bold">{translate("gameWaitingRoom.labels.players")}: </span>
                                {playersAmount}/{maxPlayersAmount}
                            </p>
                            <button
                                className="btn btn-success fw-bold border border-black border-opacity-25"
                                onClick={handleStartGame}
                            >
                                {translate("gameWaitingRoom.buttons.startGame")}
                            </button>
                        </div>
                    </div>
                    {/* Events */}
                    <div className="custom-events d-flex flex-column align-items-center w-50 px-3 py-2">
                        <h2>{translate("gameWaitingRoom.events.title")}</h2>
                        <hr className="border border-black border-2 opacity-50 mt-0 w-100"/>
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