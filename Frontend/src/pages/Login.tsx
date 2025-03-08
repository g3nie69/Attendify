import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/login.css";

const Login: React.FC = () => {
  const [lecturerCode, setLecturerCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      navigate("/dashboard"); 
    }
  }, []);

  const handleLogin = () => {
    if (!lecturerCode) {
      setError("Please enter your lecturer code.");
      return;
    }

    setLoading(true); // Show loader
    setError(""); // Clear previous errors

    fetch("https://attendify-5pet.onrender.com/auth/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lecturer_code: lecturerCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false); // Hide loader

        if (data.error) {
          setError(data.error);
        } else {
          localStorage.setItem("access", data.access_token);
          localStorage.setItem("lecturer_id", data.lecturer_id);
          navigate("/dashboard"); 

          // Token expires after 1 hour
          setTimeout(() => {
            localStorage.removeItem("access");
          }, 3600000);
        }
      })
      .catch((err) => {
        setLoading(false); // Hide loader
        setError("Login failed. Please try again.");
      });
  };

  return (
    <div className="login-main-container">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg flex flex-col" id="login-form">
        <h2 className="text-2xl font-semibold text-gray-900">Log In</h2>
        <p className="text-gray-500 text-sm mt-2">
          Not an admin yet? <a href="#" className="text-blue-600">Request access</a>.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600 text-sm">Enter lecturer code</label>
            <input
              type="text"
              value={lecturerCode}
              onChange={(e) => setLecturerCode(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your lecture code"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            onClick={handleLogin} 
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Submit"
            )}
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="my-6 text-center text-gray-400">Or continue with following options:</div>

        <div className="flex justify-center gap-4">
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">🔵 Use App Authenticator</button>
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">🔴 Google</button>
        </div>

        <div className="mt-8 text-center text-gray-500">
          Any questions? <a href="#" className="text-blue-600">Call us now.</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
