import React, { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Menu } from "lucide-react";
import RegisteredStudents from "../components/RegisteredStudents";
import AttendanceRecords from "../components/AttendanceRecords";
import GenerateQR from "../components/GenerateQR";

const COLORS = ["#0088FE", "#00C49F"];
interface AttendanceRecord {
  lecturer_id: number;
  unit_id: number;
  status: string;
  // Add other properties if needed
}


const AdminDashboard: React.FC = () => {
  const [lecturer, setLecturer] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const sidebarRef = useRef<HTMLDivElement>(null); // Reference for detecting outside clicks

  useEffect(() => {
    const storedLecturer = localStorage.getItem("lecturer_id");
    if (storedLecturer) {
      fetch(`https://attendify-5pet.onrender.com/api/lecturers/${storedLecturer}`)
        .then((response) => response.json())
        .then((data) => setLecturer(data));
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
    fetch("https://attendify-5pet.onrender.com/api/attendance")
      .then((response) => response.json())
      .then((data) => {
        const lecturerUnitIds = units.map((unit) => unit.id);
        const filteredAttendance = data.attendance.filter(
          (record: AttendanceRecord) => record.lecturer_id === lecturer?.id && lecturerUnitIds.includes(record.unit_id)
        );
        setAttendance(filteredAttendance);
      });
  }, [units, lecturer]);

  // const attendanceData = [
  //   { name: "Present", value: attendance.filter((a) => a.status === "present").length },
  //   { name: "Absent", value: attendance.filter((a) => a.status === "Absent").length },
  // ];
  // Dummy data for testing
  console.log(attendance);
  const attendanceData = [
    { name: "Present", value: 18 },
    { name: "Absent", value: 3 },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("lecturer_id");
    localStorage.removeItem("access");
    window.location.reload();
  };

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    if (window.innerWidth < 768) {
      setSidebarOpen(false); // Close sidebar on small screens
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative w-64 bg-gray-800 text-white p-5 transition-transform duration-300 ease-in-out`}
      >
        <h2 className="text-xl font-bold mb-10">Lecturer’s Dashboard</h2>
        <ul>
          <li className="py-2 hover:bg-gray-700 p-2 rounded cursor-pointer mb-3" onClick={() => handleSectionClick("dashboard")}>
            Dashboard
          </li>
          <li className="py-2 hover:bg-gray-700 p-2 rounded cursor-pointer mb-3" onClick={() => handleSectionClick("students")}>
            Registered Students
          </li>
          <li className="py-2 hover:bg-gray-700 p-2 rounded cursor-pointer mb-3" onClick={() => handleSectionClick("attendance")}>
            Attendance Records
          </li>
          <li className="py-2 hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => handleSectionClick("qr")}>
            Generate QR Code
          </li>
        </ul>

        <div className="absolute bottom-4">
          <button className="text-red-400" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-lg shadow-md">
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold">Welcome, {lecturer?.lecturer_name} 👋🏻</h1>
        </header>

        {/* Conditional Rendering Based on Sidebar Selection */}
        {selectedSection === "dashboard" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-4">Your Units</h2>
              <ul>
                {units.map((unit) => (
                  <li key={unit.id} className="py-2 border-b">
                    {unit.unit_name} ({unit.unit_code})
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-4">Attendance Overview</h2>
              <PieChart width={300} height={300}>
                <Pie data={attendanceData} cx={150} cy={150} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value">
                  {attendanceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        )}
        {selectedSection === "students" && <RegisteredStudents />}
        {selectedSection === "attendance" && <AttendanceRecords />}
        {selectedSection === "qr" && <GenerateQR lecturerId={lecturer?.id} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
