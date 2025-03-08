import React, { useState, useEffect } from "react";

interface Student {
  student_name: string;
  reg_number: string;
  year_of_study: number;
  registered_units: string[];
}

const RegisteredStudents: React.FC = () => {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [units, setUnits] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // 1. Fetch all students
  useEffect(() => {
    fetch("https://attendify-5pet.onrender.com/api/students")
      .then((response) => response.json())
      .then((data) => setAllStudents(data.students))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  // 2. Fetch units for the logged-in lecturer
  useEffect(() => {
    const lecturerId = localStorage.getItem("lecturer_id");
    if (lecturerId) {
      fetch(`https://attendify-5pet.onrender.com/api/lecturers/${lecturerId}/units`)
        .then((response) => response.json())
        .then((data) => setUnits(data.units))
        .catch((error) => console.error("Error fetching units:", error));
    }
  }, []);

  // allStuddents: [{ id: 1,student_name: "John Doe", reg_number: "SCS/001", year_of_study: 1, registered_units: [1, 3] }]
  // units: [{ id: 1, unit_name: "Unit 1", unit_code: "CS301" }] => units taught by the lecturer (logged in)
  // 3. Filter students to only those in the lecturer's units
    useEffect(() => {
        if (allStudents.length > 0 && units.length > 0) {
        const filteredStudents = allStudents.filter((student) =>{
            student.registered_units.some((unitId) => units.map((unit) => unit.id).includes(unitId))
        }
        );
        setStudents(filteredStudents);
        }
    }, [allStudents, units]);

  // 4. Filter by search query
  const filteredStudents = students.filter((student) =>
    student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.reg_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.year_of_study.toString().includes(searchQuery)
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
              <td colSpan={3} className="text-center p-4">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegisteredStudents;
