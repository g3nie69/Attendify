import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/dashboard.css';

const Login: React.FC = () => {
  const [lecturerCode, setLecturerCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!lecturerCode) {
      setError("Please enter your lecturer code.");
      return;
    }
    fetch("http://127.0.0.1:5000/api/lecturers")
      .then((response) => response.json())
      .then((data) => {
        const lecturer = data.lecturers.find(
          (l: any) => l.lecturer_code === lecturerCode
        );
        if (lecturer) {
          console.log(lecturer);
          localStorage.setItem("lecturer", JSON.stringify(lecturer));
          navigate("/dashboard");
          console.log("Navigating to dashboard");
        } else {
          setError("Invalid lecturer code.");
        }
      })
      .catch(() => setError("An error occurred. Please try again."));
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
