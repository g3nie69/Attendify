import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import '../assets/mark-attendance.css';

const MarkAttendance = () => {
  const [searchParams] = useSearchParams();
  const [regNumber, setRegNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const expiry = searchParams.get("expiry");
  const lecturerId = searchParams.get("lecturer_id");
  const unitId = searchParams.get("unit_id");

  useEffect(() => {
    if (expiry) {
      const expiryDate = new Date(expiry);
      const now = new Date();
      if (now > expiryDate) {
        setMessage("This attendance link has expired.");
        setIsExpired(true);
      }
    }
  }, [expiry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      alert("Please enter your registration number.");
      return;
    }
    try {
      const response = await fetch("https://attendify-5pet.onrender.com/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reg_number: regNumber,
          unit_id: unitId,
          lecturer_id: lecturerId,
          date: new Date().toISOString(),
          status: "present",
        }),
      });
      const data = await response.json();
      console.log(data);
      setMessage("Attendance marked successfully!");
      setRegNumber("");
    } catch (error) {
      console.error("Error marking attendance:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="attendance-container">
      <h2>Mark Attendance</h2>
      {message && <p className={isExpired ? "error" : ""}>{message}</p>}
      {!isExpired && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="regNumber">Registration Number:</label>
          <input
            type="text"
            id="regNumber"
            name="regNumber"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            required
          />
          <button type="submit">Submit Attendance</button>
        </form>
      )}
    </div>
  );
};

export default MarkAttendance;