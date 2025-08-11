import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Transactions from "./Pages/Transactions";
import Categories from "./Pages/Categories";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Topbar from "./components/Topbar";
import AuthPage from "./Pages/AuthPage";

function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="app-container">
                {/* <Sidebar /> */}
                <div className="main-content">
                  <Navbar />
                  <Dashboard />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  {/* <Navbar /> */}
                  {/* <Topbar/> */}
                  <Transactions />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <Categories />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
