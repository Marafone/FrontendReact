import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/navbar.css";
import "./styles/game-creation-form.css";
import { ToastContainer } from 'react-toastify';


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <ToastContainer/>
  </StrictMode>
);
