import React from "react";
<<<<<<< HEAD
import 'leaflet/dist/leaflet.css';
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
=======
import QuanLyXeBuyt from "./frontend/QuanLyXeBuyt";
//import QuanLyXeBuyt from "./frontend/ThongBao";
//import QuanLyXeBuyt from "./frontend/QuanLyTaiXe";

function App() {
  return (
    <div>
      <QuanLyXeBuyt />
    </div>
  );
}

export default App;
>>>>>>> qlxbtb-code
