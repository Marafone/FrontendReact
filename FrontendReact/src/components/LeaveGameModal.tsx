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

  const { t } = languageContext; 

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("leaveGame.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t("leaveGame.message")}</p>
      </Modal.Body>
      <Modal.Footer className="w-100 d-flex justify-content-between">
        <Button
          variant="danger"
          onClick={() => navigate("/", { replace: true })}
        >
          {t("leaveGame.leave")}
        </Button>
        <Button variant="primary" onClick={onClose}>
          {t("leaveGame.stay")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeaveGameModal;