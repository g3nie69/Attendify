import React, { useState, useEffect } from "react";

interface Student {
  student_name: string;
  reg_number: string;
  year_of_study: number;
}

const RegisteredStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    fetch("https://attendify-5pet.onrender.com/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(data.students))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.reg_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.year_of_study.toString().includes(searchQuery) // Convert number to string for search
  );

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Registered Students</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search students..."
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Registration Number</th>
            <th className="border px-4 py-2">Year of Study</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.reg_number}>
                <td className="border px-4 py-2">{student.student_name}</td>
                <td className="border px-4 py-2">{student.reg_number}</td>
                <td className="border px-4 py-2">{student.year_of_study}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegisteredStudents;
