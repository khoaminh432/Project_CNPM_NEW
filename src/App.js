import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import đủ 4 trang quan trọng
import Login from "./Login";
import HomePH from "./HomePH";
import BusLineDetail from "./BusLineDetail";
import BusTracking from "./BusTracking";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePH />} />
          <Route path="/line/:id" element={<BusLineDetail />} />
          <Route path="/tracking/:lineId" element={<BusTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;