// App.jsx
import React, { useState } from "react";
import DriverMap from "../components/drivermap";
import MainPage from "../components/mainpage";
import Schedule from "../components/schedule";
import List from "../components/list";
import Noti from "../components/noti";
import Profile from "../components/profile";
import '../Assets/CSS/index.css';


function App() {
  const [currentPage, setCurrentPage] = useState("mainpage");
  const [previousPage, setPreviousPage] = useState(null);

  const handleNavigate = (page) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
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

export default App;
