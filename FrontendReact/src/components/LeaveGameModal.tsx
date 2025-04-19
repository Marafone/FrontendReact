import { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

interface LeaveGameProps {
  onClose: () => void;
}

const LeaveGameModal = ({ onClose }: LeaveGameProps) => {
  const navigate = useNavigate();
  
  const languageContext = useContext(LanguageContext);
  
  if (!languageContext) {
    throw new Error("LanguageContext must be used within a LanguageProvider.");
  }

  const { translate } = languageContext; 

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{translate("leaveGame.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{translate("leaveGame.message")}</p>
      </Modal.Body>
      <Modal.Footer className="w-100 d-flex justify-content-between">
        <Button
          variant="danger"
          onClick={() => navigate("/", { replace: true })}
        >
          {translate("leaveGame.leave")}
        </Button>
        <Button variant="primary" onClick={onClose}>
          {translate("leaveGame.stay")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeaveGameModal;