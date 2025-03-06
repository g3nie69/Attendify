import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Dashboard";
import MarkAttendance from "./pages/MarkAttendance";
import "./App.css";
import AuthGuard from "./components/AuthGaurd";

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          }
        />
        <Route path="/mark-attendance" element={<MarkAttendance />} />
      </Routes>
    </Router>
  );
};

export default App;
