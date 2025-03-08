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

  useEffect(() => {
    fetch("https://attendify-5pet.onrender.com/api/attendance")
      .then((response) => response.json())
      .then((data) => setAttendance(data.attendance))
      .catch((error) => console.error("Error fetching attendance:", error));
  }, []);

  console.log(attendance);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Attendance Records</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Student Reg Number</th>
            <th className="border px-4 py-2">Unit</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.length > 0 ? (
            attendance.map((record, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{record.reg_number}</td>
                <td className="border px-4 py-2">{record.unit_code}</td>
                <td className="border px-4 py-2">{record.date}</td>
                <td className="border px-4 py-2">{record.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">No attendance records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceRecords;
