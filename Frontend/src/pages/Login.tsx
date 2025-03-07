import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/dashboard.css";

const Login: React.FC = () => {
  const [lecturerCode, setLecturerCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fix infinite loop issue by using an empty dependency array
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      console.log("Token found, navigating to dashboard...");
      navigate("/dashboard"); // Ensures redirection happens only once
    }
  }, []); // Empty dependency array to prevent infinite loop

  const handleLogin = () => {
    if (!lecturerCode) {
      setError("Please enter your lecturer code.");
      return;
    }

    fetch("http://127.0.0.1:5000/auth/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lecturer_code: lecturerCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Login Response:", data); // Debugging log

        if (data.error) {
          setError(data.error);
        } else {
          localStorage.setItem("access", data.access_token);
          localStorage.setItem("lecturer_id", data.lecturer_id);
          console.log("Login successful, redirecting...");
          navigate("/dashboard"); // Redirect after successful login

          // Token expires after 1 hour
          setTimeout(() => {
            localStorage.removeItem("access");
            console.log("Token expired, logging out.");
          }, 3600000);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Login failed. Please try again.");
      });
  };

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
