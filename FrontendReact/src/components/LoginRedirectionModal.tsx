import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { useContext } from "react";

interface RedirectErrorModalProps {
  message: string;
  onClose: () => void;
}

const LoginRedirectionModal = ({
  message,
  onClose,
}: RedirectErrorModalProps) => {
  const navigate = useNavigate();

  const languageContext = useContext(LanguageContext);
  
  if (!languageContext) {
    throw new Error("LanguageContext must be used within a LanguageProvider.");
  }

  const { t } = languageContext; 

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("loginRedirection.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 d-flex justify-content-between">
          <Button variant="primary" onClick={() => navigate("/login")}>
            {t("loginRedirection.goToLogin")}
          </Button>
          <Button variant="danger" onClick={onClose}>
            {t("loginRedirection.close")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRedirectionModal;
