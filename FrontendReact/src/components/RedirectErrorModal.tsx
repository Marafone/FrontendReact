import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface RedirectErrorModalProps {
  message: string;
  onClose: () => void;
}

const RedirectErrorModal = ({ message, onClose }: RedirectErrorModalProps) => {
  const navigate = useNavigate();

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login Needed</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 d-flex justify-content-between">
          <Button variant="primary" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
          <Button variant="danger" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RedirectErrorModal;
