import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function StudentTable({ students, setStudents }) {

  const updateStatus = (id, status) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, status } : s
    );
    setStudents(updated);
  };

  const exportExcel = () => {
    const data = students.map((s, i) => ({
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

    saveAs(blob, `Absensi-${new Date().toLocaleDateString()}.xlsx`);
  };

  const deleteStudent = (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus siswa ini?");
    if (!confirmDelete) return;

    const filtered = students.filter((s) => s.id !== id);
    setStudents(filtered);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <div className="flex justify-end mb-3">
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          Export Excel
        </button>
      </div>

      <table className="w-full text-center">
       <thead>
          <tr className="bg-gray-100">
            <th className="p-2">No</th>
            <th className="p-2">Nama</th>
            <th className="p-2">Kelas</th>
            <th className="p-2">Status</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.kelas}</td>

              <td className="p-2 space-x-2">
                {["Hadir", "Izin", "Sakit", "Alpha"].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateStatus(s.id, st)}
                    className={`px-2 py-1 rounded text-sm ${
                      s.status === st
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </td>

              <td className="p-2">
                <button
                  onClick={() => deleteStudent(s.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}