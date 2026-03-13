import React, { useState } from "react";
import { User, Hash, School, X } from "lucide-react";

export default function AddStudentModal({ close, setStudents, students }) {
  const [name, setName] = useState("");
  const [nis, setNis] = useState("");
  const [kelas, setKelas] = useState("");

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Hanya izinkan huruf dan spasi
    if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setName(value);
    }
  };

  const handleNisChange = (e) => {
    const value = e.target.value;
    // Hanya izinkan angka
    if (value === "" || /^[0-9]*$/.test(value)) {
      setNis(value);
    }
  };

  const handleAdd = () => {
    if (!name || !kelas || !nis) {
      alert("Harap lengkapi Nama, NIS, dan Kelas!");
      return;
    }

    // Cek duplikasi NIS
    if (students.find(s => s.nis === nis)) {
      alert("Nomor Induk (NIS) sudah terdaftar!");
      return;
    }

    setStudents([
      ...students,
      {
        id: Date.now(),
        nis,
        name,
        kelas,
        status: "Hadir"
      }
    ]);

    close();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User className="text-indigo-500" size={24} />
            Tambah Siswa Baru
          </h2>
          <button onClick={close} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Input Nama */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
              <User size={14} className="text-indigo-400" />
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Contoh: Ahmad Maulana"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
              value={name}
              onChange={handleNameChange}
            />
            <p className="text-[10px] text-slate-400 ml-1">* Khusus huruf dan spasi</p>
          </div>

          {/* Input NIS */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
              <Hash size={14} className="text-indigo-400" />
              Nomor Induk (NIS)
            </label>
            <input
              type="text"
              placeholder="Contoh: 12345678"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono text-slate-700 font-bold"
              value={nis}
              onChange={handleNisChange}
            />
            <p className="text-[10px] text-slate-400 ml-1">* Khusus angka saja</p>
          </div>

          {/* Opsi Kelas */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
              <School size={14} className="text-indigo-400" />
              Pilih Kelas
            </label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 cursor-pointer"
            >
              <option value="">Pilih Kelas</option>
              <option>VII. 1</option>
              <option>VII. 2</option>
              <option>VIII. 1</option>
              <option>IX. 1</option>
              <option>IX. 6</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={close}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95"
          >
            Batal
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            Simpan Siswa
          </button>
        </div>
      </div>
    </div>
  );
}