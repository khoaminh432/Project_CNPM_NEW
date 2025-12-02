// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/login";
import DriverMap from "../components/drivermap";
import MainPage from "../components/mainpage";
import Schedule from "../components/schedule";
import List from "../components/list";
import Noti from "../components/noti";
import Profile from "../components/profile";
import '../Assets/CSS/index.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
}

// Main App Component
function MainApp() {
  const [currentPage, setCurrentPage] = useState("mainpage");
  const [previousPage, setPreviousPage] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const handleNavigate = (page, scheduleId = null) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
    if (scheduleId) {
      setSelectedScheduleId(scheduleId);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {currentPage === "mainpage" && (
        <MainPage 
          onNavigateToMap={() => setCurrentPage("drivermap")} 
          onNavigateToSchedule={() => setCurrentPage("schedule")} 
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === "schedule" && (
        <Schedule 
          onNavigateToMainPage={() => setCurrentPage("mainpage")} 
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === "list" && (
        <List 
          onNavigateToMainPage={() => setCurrentPage("mainpage")} 
          onNavigateToMap={() => setCurrentPage("drivermap")} 
          onNavigate={handleNavigate}
          fromDriverMap={previousPage === "drivermap"}
          scheduleId={selectedScheduleId}
        />
      )}
      {currentPage === "notification" && (
        <Noti 
          onNavigateToMainPage={() => setCurrentPage("mainpage")} 
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === "drivermap" && (
        <DriverMap 
          onBackToMain={() => setCurrentPage("mainpage")} 
          onNavigateToList={() => {
            setPreviousPage("drivermap");
            setCurrentPage("list");
          }}
        />
      )}
      {currentPage === "profile" && (
        <Profile 
          onBackToMain={() => setCurrentPage("mainpage")} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
