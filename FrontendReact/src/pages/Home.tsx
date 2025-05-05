import axiosWithLogout from "../axios";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {LanguageContext} from "../context/LanguageContext";
import {useTheme} from "../context/ThemeContext";
import "../styles/home-page.css";
import {useUserContext} from "../context/UserContext";
import {toast} from "react-toastify";
import JoinGameModal from "../components/JoinGameModal.tsx";
import GameData from "../types/game.ts";
import JoinByCodeModal from "../components/JoinByCodeModal.tsx";
import {PageChangeDirection} from "../types/pagination.ts";

const Home = () => {
    const navigate = useNavigate();
    const playersAmount = 4;
    const [page, setPage] = useState(1);
    const [lobbies, setLobbies] = useState<GameData[]>([]);
    const [loading, setLoading] = useState(true);
    // reconnection option
    const [isReconnectionPossible, setIsReconnectionPossible] = useState(false);
    const [reconnectableGameId, setReconnectableGameId] = useState<bigint>(
        BigInt(0)
    );

    const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
    const context = useContext(LanguageContext);
    const {username, setUsername} = useUserContext();

    const {theme} = useTheme();

    const [showJoinGameByCodeModal, setShowJoinGameByCodeModal] = useState(false);
  
    if (!context) {
        throw new Error("LanguageContext must be used within a LanguageProvider.");
    }

    const {translate} = context; // Now `context` is guaranteed to be defined

    useEffect(() => {
        if (username == null) // only send request to get active games when user is logged in
            return

        axios // use standard axios to not redirect to login on 401 http status code received
            .get("/game/active", {
                transformResponse: [(data) => data], // disable automatic parsing
            })
            .then((response) => {
                if (response.data) {
                    setIsReconnectionPossible(true);
                    setReconnectableGameId(response.data);
                }
            }).catch((error) => {
            if (error.response.status == 401) {
                setUsername(null)
            }
            console.log(error)
        });
    }, []);

    useEffect(() => {
        const fetchGames = () => {
            axiosWithLogout.get("/game/waiting").then((response) => {
                setLobbies(response.data);
            });
        };
        setLoading(true);
        fetchGames()
        setLoading(false);

        //keep refreshing games
        const intervalID = setInterval(fetchGames, 4000);

        return () => clearInterval(intervalID)
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    })
  
    const handleNavigation = (gameData: GameData) => {
        navigate("/wait-for-game", {state: gameData});
    };

    const handleJoinGame = (
        gameData: GameData,
        joinGameCode: string
    ) => {
          
        const joinGameRequestData = {
            joinGameCode: joinGameCode,
        };

        axiosWithLogout
            .post(`/game/${gameData.gameId}/join`, joinGameRequestData)
            .then(() => {
                handleNavigation(gameData);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const handleLobbyClick = (gameData: GameData) => {
        if (gameData.isPrivate)
            setSelectedGame(gameData);
        else
            handleJoinGame(gameData, "");
    }

    const handleReconnect = (gameId: bigint) => {
        setIsReconnectionPossible(false);
        navigate("/play-game", {
            state: {gameId: BigInt(gameId)},
        });
    };

    function renderLobbies() {
        if (loading) {
            return (
                <div
                    className="d-flex justify-content-center align-items-center container-fluid border-bottom border-black border-opacity-25 border-1 p-2">
                    <p className="m-0">{translate("home.loading")}</p>{" "}
                </div>
            );
        }

        if (lobbies.length === 0) {
            return (
                <div className="border-bottom border-black border-opacity-25 border-1 p-2">
                    No games available
                </div>
            );
        }

        return lobbies.map((gameData) => renderLobby(gameData));
    }
        
    const changePage = (direction: PageChangeDirection) => {
      if (direction === PageChangeDirection.LEFT && page > 1)
          setPage(page - 1);
      else if (direction === PageChangeDirection.RIGHT)
          setPage(page + 1);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === "ArrowLeft")
          changePage(PageChangeDirection.LEFT);
      else if (key === "ArrowRight")
          changePage(PageChangeDirection.RIGHT);
    }

    function renderLobby(gameData: GameData) {
        return (
            <div
                key={gameData.gameId}
                className="custom-lobby-div-element row border-bottom border-black border-opacity-25 border-1 p-2"
                onClick={() => handleLobbyClick(gameData)}>
                <p className="m-0 col-4 text-start">
                    {gameData.isPrivate && <i className="bi bi-lock-fill m-0 p-0"></i>}
                    {gameData.gameName}
                </p>
                <p className="m-0 col-4 text-center">{gameData.gameType}</p>
                <p className="m-0 col-4 text-end">
                    {gameData.joinedPlayersAmount}/{playersAmount}
                </p>
            </div>
        )
    }

    return (
        <>
            {selectedGame &&
                <JoinGameModal onHide={() => setSelectedGame(null)} onJoin={handleJoinGame} gameData={selectedGame}/>}
          
            {showJoinGameByCodeModal &&
                <JoinByCodeModal
                    onHide={() => setShowJoinGameByCodeModal(false)}
                    handleJoinGame={handleJoinGame}
                />}
          
            <div className="container-fluid d-flex flex-column align-items-center h-100 p-3 w-100">
                {isReconnectionPossible && (
                    <div className="w-50 mb-1 mt-2">
                        <button
                            className="btn btn-success w-100 fw-bold"
                            onClick={() => handleReconnect(reconnectableGameId)}
                        >
                            Reconnect
                        </button>
                    </div>
                )}
                {/* Create Game Button */}
                <div className="w-50 mb-4 mt-2">
                    <Link
                        to="/create-game"
                        className="custom-create-game-btn btn btn-primary border border-black border-opacity-25 w-100 w-md-auto fw-bold"
                    >
                        {translate("home.createGameBtn")} {/* Create Game Button */}
                    </Link>
                </div>

                <div className="row w-100">
                    {/* Left Column: News and Create Game Button */}
                    <div className="col-12 col-md-4 mb-3">
                        {/* News Section */}
                        <div>
                            <h1>{translate("home.newsTitle")}</h1> {/* News Title */}
                            <p>{translate("home.newsContent")}</p> {/* News Content */}
                        </div>
                    </div>

                    {/* Right Column: Lobby Table */}
                    <div className="col-12 col-md-8 mb-3">
                        <div
                            className="custom-lobby-div d-flex flex-column w-100 border border-black border-opacity-25 border-2">
                            {/* Header */}
                            <div
                                className="row border-bottom border-black border-opacity-25 border-1 p-2">
                                <p className="fw-bold m-0 col-4 text-left">{translate("home.lobbyName")}</p>{" "}
                                {/* Lobby Name */}
                                <p className="fw-bold m-0 col-4 text-center">{translate("home.gameType")}</p>{" "}
                                {/* Game Type */}
                                <p className="fw-bold m-0 col-4 text-end">{translate("home.players")}</p>{" "}
                                {/* Players */}
                            </div>
                            {/* Lobbies Info */}
                            {renderLobbies()}
                            {/* Pagination */}
                            <div
                                className="row p-2 mt-auto border-black border-top border-opacity-25">
                                {/* Prev */}
                                <div className="col-5 d-flex justify-content-end">
                                    <button
                                        disabled={page <= 1}
                                        className="custom-lobby-change-page-btn fw-bold border-0"
                                        onClick={() => changePage(PageChangeDirection.LEFT)}
                                    >
                                        <i className="bi bi-arrow-left me-1"></i>
                                        <span className="m-0">{translate("home.prevPage")}</span>{" "}
                                    </button>
                                </div>

                                {/* Page Text */}
                                <p className="col-2 fw-bold m-0 text-center">
                                    {translate("home.pageText")} {page}
                                </p>{" "}

                                {/* Next */}
                                <div className="col-5 d-flex justify-content-start">
                                    <button
                                        className="custom-lobby-change-page-btn gap-2 fw-bold border-0 text-start"
                                        onClick={() => changePage(PageChangeDirection.RIGHT)}
                                    >
                                        <span className="m-0">{translate("home.nextPage")}</span>{" "}
                                        <i className="bi bi-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Join Friend Game Button */}
                <div className="w-50 mb-4 mt-2 d-flex justify-content-center">
                    <button className="btn btn-success w-50" onClick={() => setShowJoinGameByCodeModal(true)}>
                        {translate("home.joinGameBtn")}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;
