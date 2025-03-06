import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../assets/dashboard.css";

interface Student {
  student_name: string;
  reg_number: string;
  year_of_study: number;
  registered_units: number[];
}

interface Attendance {
  student_name?: string;
  student_id?: string;
  unit_name?: string;
  unit_id: number;
  date: string;
  status: string;
  lecturer_id: number;
  reg_number?: string;
}

const AdminDashboard: React.FC = () => {
  const [lecturer, setLecturer] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState(5);
  const [qrLink, setQrLink] = useState("");

  useEffect(() => {
    const storedLecturer = localStorage.getItem("lecturer_id");
    if (storedLecturer) {
      fetch(`https://attendify-5pet.onrender.com/api/lecturers/${storedLecturer}`)
        .then((response) => response.json())
        .then((data) => setLecturer(data.lecturer));
    }
  }, []);

  useEffect(() => {
    if (lecturer) {
      fetch(`https://attendify-5pet.onrender.com/api/lecturers/${lecturer.id}/units`)
        .then((response) => response.json())
        .then((data) => setUnits(data.units));
    }
  }, [lecturer]);

  useEffect(() => {
    fetch("https://attendify-5pet.onrender.com/api/students")
      .then((response) => response.json())
      .then((data) => {
        const allStudents: Student[] = data.students;
        const lecturerUnitIds = units.map((unit) => unit.id);

        const filteredStudents = allStudents.filter((student) =>
          student.registered_units.some((unitId) => lecturerUnitIds.includes(unitId))
        );

        setStudents(filteredStudents);
      })
      .catch((error) => console.error("Error fetching students:", error));
  }, [units]);

  useEffect(() => {
    fetch("https://attendify-5pet.onrender.com/api/attendance")
      .then((response) => response.json())
      .then((data) => {
        const attendanceRecords: Attendance[] = data.attendance;
        const lecturerUnitIds = units.map((unit) => unit.id);

        const filteredAttendance = attendanceRecords.filter(
          (record) => record.lecturer_id === lecturer?.id && lecturerUnitIds.includes(record.unit_id)
        );

        setAttendance(filteredAttendance);
      })
      .catch((error) => console.error("Error fetching attendance:", error));
  }, [units, lecturer]);

  const generateQRCode = () => {
    if (!selectedUnit) {
      alert("Please select a unit.");
      return;
    }
    const expiryDate = new Date(Date.now() + expiryMinutes * 60000).toISOString();
    const link = `https://attendify-five.vercel.app/mark-attendance?lecturer_id=${lecturer.id}&unit_id=${selectedUnit}&expiry=${encodeURIComponent(expiryDate)}`;
    setQrLink(link);
  };

  return (
    <div className="admin-container" id="dashboard">
      <header>
        <h1>Welcome, <span id="lecturerName">{lecturer?.lecturer_name}</span></h1>
      </header>

      <div className="dashboard-section" id="unitsSection">
        <h2>Your Units</h2>
        <ul id="unitsList">
          {units.map((unit) => (
            <li key={unit.id}>{unit.unit_name} ({unit.unit_code})</li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section" id="studentsSection">
        <h2>Registered Students</h2>
        <table id="studentsTable">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Registration Number</th>
              <th>Year of Study</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.reg_number}>
                  <td>{student.student_name}</td>
                  <td>{student.reg_number}</td>
                  <td>{student.year_of_study}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section" id="attendanceSection">
        <h2>Attendance Records</h2>
        <table id="attendanceTable">
          <thead>
            <tr>
              <th>Student Reg Number</th>
              <th>Unit</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length > 0 ? (
              attendance.map((record, index) => (
                <tr key={index}>
                  <td>{record.student_name || record.reg_number}</td>
                  <td>{record.unit_name || `Unit ${record.unit_id}`}</td>
                  <td>{record.date}</td>
                  <td>{record.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No attendance records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section" id="qrSection">
        <h2>Generate Attendance QR Code</h2>
        <select id="unitSelect" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
          <option value="">--Select Unit--</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>{unit.unit_name} ({unit.unit_code})</option>
          ))}
        </select>
        <input
          type="number"
          value={expiryMinutes}
          onChange={(e) => setExpiryMinutes(parseInt(e.target.value))}
          placeholder="Enter minutes until link expires"
          min="1"
        />
        <button onClick={generateQRCode}>Generate QR Code</button>
        {qrLink && (
          <div id="qrCodeDisplay">
            {/* <p>{qrLink}</p> */}
            <QRCodeCanvas value={qrLink} size={150} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
