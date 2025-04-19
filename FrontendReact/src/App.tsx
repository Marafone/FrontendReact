import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { UserProvider } from "./context/UserContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import MainLayout from "./layouts/MainLayout";
import GameCreation from "./pages/GameCreation";
import GameWaitingRoom from "./pages/GameWaitingRoom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GamePlayingRoom from "./pages/GamePlayingRoom";
import Rules from "./pages/Rules";
import LoginSuccess from "./pages/LoginSuccess";
import PlayersRanking from "./pages/PlayersRanking";

export interface User {
  username: string;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <LanguageProvider>
            <Routes>
              {/* Routes using MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="create-game" element={<GameCreation />} />
                <Route path="players-ranking" element={<PlayersRanking />} />
              </Route>
              {/* Routes without MainLayout */}
              <Route path="/wait-for-game" element={<GameWaitingRoom />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login-success" element={<LoginSuccess />} />
              <Route path="/play-game" element={<GamePlayingRoom />} />
              <Route path="/rules" element={<Rules />} />
            </Routes>
          </LanguageProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
