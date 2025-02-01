import React from "react";
import { Button, Modal } from "react-bootstrap";

interface InfoModalProps {
  title?: string;
  message: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ title, message, onClose }) => {
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

export default InfoModal;
