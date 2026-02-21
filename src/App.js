import React, { useState, useEffect } from "react";
import "./input.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StudentTable from "./components/StudentTable";
import ImportExcel from "./components/ImportExcel";
import AddStudentModal from "./components/AddStudentModal";
import StatsCard from "./components/StatsCard";

function App() {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // Load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("absensi");
    if (saved) setStudents(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("absensi", JSON.stringify(students));
  }, [students]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="p-4 overflow-y-auto space-y-4">

          {/* Statistik */}
          <StatsCard students={students} />

          {/* Action Section */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              + Tambah Siswa
            </button>

            <ImportExcel setStudents={setStudents} students={students} />
          </div>

          {/* Table */}
          <StudentTable
            students={students}
            setStudents={setStudents}
          />
        </main>
      </div>

      {openModal && (
        <AddStudentModal
          setStudents={setStudents}
          students={students}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}

export default App;