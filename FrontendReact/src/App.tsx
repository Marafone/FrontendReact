import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
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
import axios from 'axios';
import {useState, useEffect, createContext, useContext} from "react";


export interface User {
  username: string;
}

function App() {

  useEffect(() => {
    async function fetchData(){
      const csrfToken = await axios.get("/csrf",{
        withCredentials: true
      });
      axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken.data.token.toString();
    }
    fetchData();
  }
  ,[])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Routes using MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="create-game" element={<GameCreation />} />
        </Route>
        {/* Routes without MainLayout */}
        <Route path="/wait-for-game" element={<GameWaitingRoom />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/play-game" element={<GamePlayingRoom />} />
        <Route path="/rules" element={<Rules />} />
      </>
    )
  );

  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <RouterProvider router={router} />
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;