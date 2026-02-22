import React, { useState, useEffect } from "react";
import "./input.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StudentTable from "./components/StudentTable";
import ImportExcel from "./components/ImportExcel";
import AddStudentModal from "./components/AddStudentModal";
import StatsCard from "./components/StatsCard";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import JurnalMengajar from "./pages/JurnalMengajar";
import Login from "./pages/Login";

function App() {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ===== LOAD USER =====
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ===== LOAD ABSENSI =====
  useEffect(() => {
    const saved = localStorage.getItem("absensi");
    if (saved) setStudents(JSON.parse(saved));
  }, []);

  // ===== SAVE ABSENSI =====
  useEffect(() => {
    localStorage.setItem("absensi", JSON.stringify(students));
  }, [students]);

  return (
    <Router>
      <Switch>

        {/* ================= LOGIN ================= */}
        <Route path="/login">
          {user ? <Redirect to="/" /> : <Login setUser={setUser} />}
        </Route>

        {/* ================= PROTECTED ROUTES ================= */}
        <Route>
          {!user ? (
            <Redirect to="/login" />
          ) : (
            <div className="flex h-screen bg-slate-100">

              <Sidebar
                open={sidebarOpen}
                close={() => setSidebarOpen(false)}
              />

              <div className="flex-1 flex flex-col overflow-hidden">

                <Header
                  toggleSidebar={() => setSidebarOpen(true)}
                  user={user}
                  setUser={setUser}
                />

                <main className="p-4 overflow-y-auto">

                  <Switch>

                    {/* ===== DASHBOARD ===== */}
                    <Route exact path="/">
                      <StatsCard students={students} />
                    </Route>

                    {/* ===== ABSENSI ===== */}
                    <Route path="/absensi">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => setOpenModal(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                          >
                            + Tambah Siswa
                          </button>

                          <ImportExcel
                            setStudents={setStudents}
                            students={students}
                          />
                        </div>

                        <StudentTable
                          students={students}
                          setStudents={setStudents}
                        />

                      </div>
                    </Route>

                    {/* ===== JURNAL ===== */}
                    <Route path="/jurnal">
                      <JurnalMengajar user={user} />
                    </Route>

                    {/* DEFAULT */}
                    <Redirect to="/" />

                  </Switch>

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
          )}
        </Route>

      </Switch>
    </Router>
  );
}

export default App;