import React, { useEffect } from "react"
import { Button, Modal } from "react-bootstrap";
import "../styles/error-modal.css";
import { useTheme } from "../context/ThemeContext";

interface ErrorModalProps {
  title?: string;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ title, message, onClose }) => {

  const { theme } = useTheme();
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Modal classnName="error-modal" show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Error"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
