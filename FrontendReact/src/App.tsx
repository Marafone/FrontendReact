import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext.tsx";
import MainLayout from "./layouts/MainLayout";
import GameCreation from "./pages/GameCreation";
import GameWaitingRoom from "./pages/GameWaitingRoom";
import Home from "./pages/Home";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";

export interface User {
  username: string;
}

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Routes using MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="create-game" element={<GameCreation />} />
        </Route>
        {/* Routes without MainLayout */}
        <Route path="/wait-for-game" element={<GameWaitingRoom />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </>
    )
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
