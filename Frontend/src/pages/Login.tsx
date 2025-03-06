import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/dashboard.css";

const Login: React.FC = () => {
  const [lecturerCode, setLecturerCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!lecturerCode) {
      setError("Please enter your lecturer code.");
      return;
    } // Response with access if the lecturer code is correct
    fetch("https://attendify-5pet.onrender.com/auth/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lecturerCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          localStorage.setItem("access", data.access);
          navigate("/dashboard");
        }
      });
  };

  // use token to check if the user is already logged in
  if (localStorage.getItem("access")) {
    navigate("/dashboard");
  }

  // token expires after 1 hour
  setTimeout(() => {
    localStorage.removeItem("access");
  }
  , 3600000);

  return (
    <div className="login-form">
      <h2>Lecturer Login</h2>
      <input
        type="text"
        value={lecturerCode}
        onChange={(e) => setLecturerCode(e.target.value)}
        placeholder="Enter Lecturer Code"
        required
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
