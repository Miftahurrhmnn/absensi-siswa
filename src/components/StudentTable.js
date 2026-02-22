import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Trash2, Download } from "lucide-react";

export default function StudentTable({ students, setStudents }) {

  const [selectedClass, setSelectedClass] = React.useState("");

  // ================= UNIQUE KELAS =================
  const uniqueClasses = [
    ...new Set(students.map((s) => s.kelas))
  ];

  // ================= FILTER DATA =================
  const filteredStudents = selectedClass
    ? students.filter((s) => s.kelas === selectedClass)
    : students;

  // ================= UPDATE STATUS =================
  const updateStatus = (id, status) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, status } : s
    );
    setStudents(updated);
  };

  // ================= DELETE =================
  const deleteStudent = (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus siswa ini?");
    if (!confirmDelete) return;
    setStudents(students.filter((s) => s.id !== id));
  };

  // ================= EXPORT =================
  const exportExcel = () => {
    if (filteredStudents.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    const data = filteredStudents.map((s, i) => ({
      No: i + 1,
      Nama: s.name,
      Kelas: s.kelas,
      Status: s.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(
      blob,
      `Absensi-${selectedClass || "Semua-Kelas"}.xlsx`
    );
  };

  // ================= STATUS STYLE =================
  const statusStyle = (status) => {
    switch (status) {
      case "Hadir":
        return "bg-emerald-100 text-emerald-600";
      case "Izin":
        return "bg-yellow-100 text-yellow-600";
      case "Sakit":
        return "bg-blue-100 text-blue-600";
      case "Alpha":
        return "bg-rose-100 text-rose-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">

      {/* HEADER + FILTER */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">

        <h2 className="text-lg font-semibold text-slate-700">
          Data Absensi Siswa
        </h2>

        <div className="flex gap-3 items-center">

          {/* FILTER KELAS */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Semua Kelas</option>
            {uniqueClasses.map((kelas, index) => (
              <option key={index} value={kelas}>
                {kelas}
              </option>
            ))}
          </select>

          {/* EXPORT BUTTON */}
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            <Download size={16} />
            Export
          </button>

        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Kelas</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s, i) => (
              <tr
                key={s.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium text-slate-700">
                  {s.name}
                </td>
                <td className="p-3 text-slate-500">{s.kelas}</td>

                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    {["Hadir", "Izin", "Sakit", "Alpha"].map((st) => (
                      <button
                        key={st}
                        onClick={() => updateStatus(s.id, st)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                          s.status === st
                            ? statusStyle(st)
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteStudent(s.id)}
                    className="text-rose-500 hover:text-rose-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="md:hidden space-y-4">
        {filteredStudents.map((s) => (
          <div
            key={s.id}
            className="border border-slate-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-slate-700">
                  {s.name}
                </p>
                <p className="text-sm text-slate-500">
                  {s.kelas}
                </p>
              </div>

              <button
                onClick={() => deleteStudent(s.id)}
                className="text-rose-500"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Hadir", "Izin", "Sakit", "Alpha"].map((st) => (
                <button
                  key={st}
                  onClick={() => updateStatus(s.id, st)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    s.status === st
                      ? statusStyle(st)
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}