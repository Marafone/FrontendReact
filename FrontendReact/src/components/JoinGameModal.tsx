import {Button, Modal} from "react-bootstrap";
import {useState} from "react";
import GameData from "../types/game.ts";

interface JoinGameModalProps {
    onHide: () => void;
    onJoin: (gameData: GameData, joinGameCode: string) => void;
    gameData: GameData;
}

const JoinGameModal = ({onHide, onJoin, gameData}: JoinGameModalProps) => {
    const [joinGameCode, setJoinGameCode] = useState("");

    return (
        <Modal onHide={onHide} show centered={true}>
            <Modal.Header closeButton>
                <Modal.Title>Enter Game Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input className="w-75 input-group-text m-auto"
                       type="password"
                       value={joinGameCode}
                       placeholder="Enter password..."
                       onChange={(e) => setJoinGameCode(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => onJoin(gameData, joinGameCode)}>Join Game</Button>
                <Button variant="secondary" onClick={onHide}>Leave</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default JoinGameModal;