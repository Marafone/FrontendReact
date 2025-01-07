import React from "react";
import { Button, Modal } from "react-bootstrap";

interface ErrorModalProps {
  title?: string;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ title, message, onClose }) => {
  return (
    <Modal show onHide={onClose}>
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

export default ErrorModal;
