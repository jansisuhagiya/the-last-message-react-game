import { Navigate, Route, Routes } from "react-router-dom";

import { useGame } from "./context/GameContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Arrival from "./scenes/Arrival";
import Bedroom from "./scenes/Bedroom";

import Phase3Clock from "./components/ClockPuzzle";
import Phase4Radio from "./components/RadioPuzzle";
import Phase5Photograph from "./components/Phase5Photograph";
import Phase6HiddenNegative from "./components/Phase6HiddenNegative";
import Phase7Puzzle from "./components/Phase7Puzzle";
import Phase8Puzzle from "./components/Phase8Puzzle";
import Phase9Puzzle from "./components/Phase9Puzzle";
import Phase10Puzzle from "./components/Phase10Puzzle";
import Phase11Puzzle from "./components/Phase11Puzzle";
import Phase12Puzzle from "./components/Phase12Puzzle";
import EndingScreen from "./components/EndingScreen";
import Chapter2 from "./components/Chapter2";
import Phase15Inside from "./components/Phase15Inside";
import Phase16Upstairs from "./components/Phase16Upstairs";
import Phase17Hallway from "./components/Phase17Hallway";
import Phase18Study from "./components/Phase18Study";
import Phase19Room from "./components/Phase19Room";
import Phase20 from "./components/Phase20";
import Phase21 from "./components/Phase21";
import Phase22 from "./components/Phase22";

import "./App.css";


function Game() {
  const { gamePhase } = useGame();

  console.log("GAME RENDER:", {
    gamePhase,
  });


  /*
    PHASE 1
    Arrival Welcome Screen
  */

  if (gamePhase === 1) {
    return <Arrival />;
  }


  if (gamePhase === 2) {
    return <Bedroom />;
  }

  if (gamePhase === 3) {
    return <Phase3Clock />;
  }

  if (gamePhase === 4) {
    return <Phase4Radio />;
  }

  if (gamePhase === 5) return <Phase5Photograph />;

  if (gamePhase === 6) return <Phase6HiddenNegative />;

  if (gamePhase === 7) return <Phase7Puzzle />;

  if (gamePhase === 8) return <Phase8Puzzle />;

  if (gamePhase === 9) return <Phase9Puzzle />; 

  if (gamePhase === 10) return <Phase10Puzzle />; 

  if (gamePhase === 11) return <Phase11Puzzle />;

  if (gamePhase === 12) return <Phase12Puzzle />;
  /*

    PHASE 13
    Chapter 1 Ending
  */

  if (gamePhase === 13) {
    return <EndingScreen />;
  }


  /*
    CHAPTER 2
    PHASE 14
  */

  if (gamePhase === 14) {
    return <Chapter2 />;
  }


  /*
    PHASE 15
  */

  if (gamePhase === 15) {
    return <Phase15Inside />;
  }


  /*
    PHASE 16
  */

  if (gamePhase === 16) {
    return <Phase16Upstairs />;
  }


  /*
    PHASE 17
  */

  if (gamePhase === 17) {
    return <Phase17Hallway />;
  }


  /*
    PHASE 18
  */

  if (gamePhase === 18) {
    return <Phase18Study />;
  }


  /*
    PHASE 19
  */

  if (gamePhase === 19) {
    return <Phase19Room />;
  }


  /*
    PHASE 20
  */

  if (gamePhase === 20) {
    return <Phase20 />;
  }


  /*
    PHASE 21
  */

  if (gamePhase === 21) {
    return <Phase21 />;
  }


  /*
    PHASE 22
    FINAL ENDING
  */

  if (gamePhase === 22) {
    return <Phase22 />;
  }


  /*
    SAFETY FALLBACK
  */

  return <Arrival />;
}


/*
  LOGOUT
*/

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
}


/*
  PROTECTED GAME
*/

function ProtectedGame() {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <div className="game-container">

      <button
        type="button"
        className="permanent-logout"
        onClick={logout}
        aria-label="Log out"
      >
        LOG OUT
      </button>

      <Game />

    </div>
  );
}


/*
  APP
*/

export default function App() {
  return (
    <Routes>

      {/* LOGIN */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* REGISTER */}

      <Route
        path="/register"
        element={<Register />}
      />


      {/* GAME */}

      <Route
        path="/game"
        element={<ProtectedGame />}
      />


      {/* DEFAULT */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* UNKNOWN ROUTES */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}