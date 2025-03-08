import React, { useState, useEffect } from "react";

interface Attendance {
  student_name: string;
  reg_number: string;
  unit_code: string;
  date: string;
  status: string;
}

const AttendanceRecords: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<Attendance[]>([]);
  const [searchDate, setSearchDate] = useState<string>("");
  const [searchUnit, setSearchUnit] = useState<string>("");

  useEffect(() => {
    fetch("https://attendify-5pet.onrender.com/api/attendance")
      .then((response) => response.json())
      .then((data) => {
        setAttendance(data.attendance);
        setFilteredAttendance(data.attendance); // Initialize filtered records
      })
      .catch((error) => console.error("Error fetching attendance:", error));
  }, []);

  // Filter function
  useEffect(() => {
    let filtered = attendance;

    if (searchDate) {
      filtered = filtered.filter((record) => record.date.startsWith(searchDate));
    }

    if (searchUnit) {
      filtered = filtered.filter((record) => record.unit_code.toLowerCase().includes(searchUnit.toLowerCase()));
    }

    setFilteredAttendance(filtered);
  }, [searchDate, searchUnit, attendance]);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Attendance Records</h2>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <input
          type="date"
          className="border p-2 rounded"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Search by Unit Code"
          value={searchUnit}
          onChange={(e) => setSearchUnit(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Student Reg Number</th>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Unit</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((record, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{record.reg_number}</td>
                <td className="border px-4 py-2">{record.student_name}</td>
                <td className="border px-4 py-2">{record.unit_code}</td>
                <td className="border px-4 py-2">{record.date}</td>
                <td className={`border px-4 py-2 ${record.status === "present" ? "text-green-600 font-semibold" : "text-red-600"}`}>
                  {record.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">No matching records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceRecords;
