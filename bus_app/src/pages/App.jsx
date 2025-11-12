// App.jsx
import React, { useState } from "react";
import DriverMap from "../components/drivermap";
import MainPage from "../components/mainpage";
import '../Assets/CSS/index.css';


function App() {
  const [currentPage, setCurrentPage] = useState("mainpage");

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {currentPage === "mainpage" ? (
        <MainPage onNavigateToMap={() => setCurrentPage("drivermap")} />
      ) : (
        <DriverMap onBackToMain={() => setCurrentPage("mainpage")} />
      )}
    </div>
  );
}

export default App;
