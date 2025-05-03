import {Button, Modal} from "react-bootstrap";
import {useState} from "react";

interface GameCodeModalProps {
    gameCode: bigint;
    onHide: () => void;
}

const GameCodeModal = ({gameCode, onHide}: GameCodeModalProps) => {
    const [copyButtonText, setCopyButtonText] = useState("Copy");
    const [isCopyButtonDisabled, setIsCopyButtonDisabled] = useState(false);

    const onCopyBtnClick = () => {
        navigator.clipboard.writeText(gameCode.toString())
        setCopyButtonText("Copied!");
        setIsCopyButtonDisabled(true);
    }

    return (
        <Modal size="sm" show centered onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Game Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-center m-0 border-2 border-black p-2">{gameCode.toString()}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onCopyBtnClick}
                        disabled={isCopyButtonDisabled}>{copyButtonText}</Button>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GameCodeModal;