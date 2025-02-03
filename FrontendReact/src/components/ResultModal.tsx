import React, { useEffect } from "react"
import { Button, Modal } from "react-bootstrap";
import "../styles/info-call-result-modal.css";
import { useTheme } from "../context/ThemeContext";

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

  const { theme } = useTheme();
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Modal className="call-info-result" show onHide={onClose} backdrop="static" keyboard={false} centered>
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
