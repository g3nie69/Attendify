import React, { useState, useEffect } from "react";

interface Student {
  student_name: string;
  reg_number: string;
  year_of_study: number;
}

const RegisteredStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch("https://attendify-5pet.onrender.com/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(data.students))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Registered Students</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Registration Number</th>
            <th className="border px-4 py-2">Year of Study</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
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
