import React, { useEffect } from "react"
import { Button, Modal } from "react-bootstrap";
import "../styles/info-call-result-modal.css";
import { useTheme } from "../context/ThemeContext";

interface CallModalProps {
  title?: string;
  message: string;
  onClose: () => void;
}

// const { theme } = useTheme();

// useEffect(() => {
//   document.documentElement.setAttribute("data-theme", theme);
// }, [theme]);

const CallModal: React.FC<CallModalProps> = ({ title, message, onClose }) => {
  return (
    <Modal className="call-info-result" show onHide={onClose} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title || "Information"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CallModal;
