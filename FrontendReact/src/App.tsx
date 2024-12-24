import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import GameCreation from "./pages/GameCreation";
import GameWaitingRoom from "./pages/GameWaitingRoom";

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
      </>
    )
  );

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
