import React, { useState } from "react";

export default function AddStudentModal({ close, setStudents, students }) {
  const [name, setName] = useState("");
  const [kelas, setKelas] = useState("");

  const handleAdd = () => {
    if (!name || !kelas) return;

    setStudents([
      ...students,
      {
        id: Date.now(),
        name,
        kelas,
        status: "Hadir"
      }
    ]);

    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-3">Tambah Siswa</h2>

        <input
          type="text"
          placeholder="Nama siswa"
          className="border p-2 w-full rounded mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Kelas"
          className="border p-2 w-full rounded mb-4"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={close} className="px-4 py-2 bg-gray-300 rounded">
            Batal
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}