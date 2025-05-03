import {Button, Modal} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import {GameData} from "../types/game.ts";
import {toast} from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

interface JoinByCodeModalProps {
    onHide: () => void;
    handleJoinGame: (gameData: GameData, team: string, joinGameCode: string) => void;
}

const JoinByCodeModal = ({onHide, handleJoinGame}: JoinByCodeModalProps) => {
    const [gameId, setGameId] = useState("");
    const joinGameCode = "";
    const team = "RED";

    const onJoinGameBtnClicked = () => {
        if (gameId.trim().length === 0) {
            toast.error("Provide game code");
            return;
        }

        axios.get(`/game/waiting/${gameId}`)
            .then((response) => response.data)
            .then((gameData) => handleJoinGame(gameData, team, joinGameCode))
            .catch((error) => {
                toast.error(error.response.data);
            });
    }

    return (
        <Modal show onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Enter game code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input className="input-group-text m-auto w-75"
                       type="text"
                       placeholder="Enter game code..."
                       value={gameId}
                       onChange={(e) => setGameId(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onJoinGameBtnClicked}>Join Game</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default JoinByCodeModal;