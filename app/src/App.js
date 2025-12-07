import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Driver components
import DriverMap from "./components/drivermap";
import DriverMainPage from "./components/mainpage";
import DriverSchedule from "./components/schedule";
import DriverList from "./components/list";
import DriverNoti from "./components/noti";
import DriverProfile from "./components/profile";

// Admin components  
import AdminApp from "./components/admin/Admin";
import Login from "./components/login";

import './Assets/CSS/index.css';

// Protected Route Component with role checking
function ProtectedRoute({ children, requiredRole }) {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    
    // If a specific role is required, check it
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate home based on their actual role
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (user.role === 'driver') {
        return <Navigate to="/driver" replace />;
      }
      return <Navigate to="/login" replace />;
    }
    
    return children;
  } catch (error) {
    console.error('Error parsing user:', error);
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
}

// Driver Main App Component
function DriverApp() {
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
        <DriverMainPage 
          onNavigateToMap={() => setCurrentPage("drivermap")} 
          onNavigateToSchedule={() => setCurrentPage("schedule")} 
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === "schedule" && (
        <DriverSchedule 
          onNavigateToMainPage={() => setCurrentPage("mainpage")} 
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === "list" && (
        <DriverList 
          onNavigateToMainPage={() => setCurrentPage("mainpage")} 
          onNavigateToMap={() => setCurrentPage("drivermap")} 
          onNavigate={handleNavigate}
          fromDriverMap={previousPage === "drivermap"}
          scheduleId={selectedScheduleId}
        />
      )}
      {currentPage === "notification" && (
        <DriverNoti 
          onNavigateToMainPage={() => setCurrentPage("mainpage")} 
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === "drivermap" && (
        <DriverMap 
          onBackToMain={() => setCurrentPage("mainpage")} 
          onNavigateToList={(scheduleId) => {
            setPreviousPage("drivermap");
            setSelectedScheduleId(scheduleId);
            setCurrentPage("list");
          }}
        />
      )}
      {currentPage === "profile" && (
        <DriverProfile 
          onBackToMain={() => setCurrentPage("mainpage")} 
        />
      )}
    </div>
  );
}

// Admin Wrapper Component
function AdminWrapper() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return <AdminApp user={user} onLogout={handleLogout} />;
}

// Login Wrapper Component - routes based on user role
// Login wrapper - just render the Login component
function LoginWrapper() {
  return <Login />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<LoginWrapper />} />
        
        {/* Driver routes */}
        <Route 
          path="/driver" 
          element={
            <ProtectedRoute requiredRole="driver">
              <DriverApp />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminWrapper />
            </ProtectedRoute>
          } 
        />
        
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Legacy /home route - redirect based on role */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Navigate to="/driver" replace />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
