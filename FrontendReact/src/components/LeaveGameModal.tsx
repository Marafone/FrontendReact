import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface LeaveGameProps {
  onClose: () => void;
}

const LeaveGameModal = ({ onClose }: LeaveGameProps) => {
  const navigate = useNavigate();

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Warning: Leaving the Game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Leaving the game now may result in lost progress. Do you really want
          to exit?
        </p>
      </Modal.Body>
      <Modal.Footer className="w-100 d-flex justify-content-between">
        <Button
          variant="danger"
          onClick={() => navigate("/", { replace: true })}
        >
          Leave Game
        </Button>
        <Button variant="primary" onClick={onClose}>
          Stay in Game
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeaveGameModal;
