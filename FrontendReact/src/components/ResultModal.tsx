import React from "react";
import { Button, Modal } from "react-bootstrap";

interface ResultModalProps {
  title?: string;
  message: string;
  winnerTeam: string;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  title,
  message,
  winnerTeam,
  onClose,
}) => {
  return (
    <Modal show onHide={onClose} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>{title || "Result"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p
          className={`fw-bold mt-3 ${
            winnerTeam == "RED" ? "text-danger" : "text-primary"
          }`}
        >
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Quit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResultModal;
