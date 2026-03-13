import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { UserPlus, FileUp, Download, Trash2, Search, GraduationCap } from "lucide-react";

export default function DataSiswa({ students, setStudents }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    nis: "",
    name: "",
    kelas: ""
  });

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setForm({ ...form, name: value });
    }
  };

  const handleNisChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*$/.test(value)) {
      setForm({ ...form, nis: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") handleNameChange(e);
    else if (name === "nis") handleNisChange(e);
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (!form.nis || !form.name || !form.kelas) {
      alert("Lengkapi semua data siswa terlebih dahulu");
      return;
    }

    // Check for duplicate NIS
    if (students.find(s => s.nis === form.nis)) {
      alert("Nomor Induk (NIS) sudah terdaftar!");
      return;
    }

    setStudents([
      ...students,
      {
        id: Date.now(),
        ...form,
        status: "Hadir" // Default status for attendance consistency
      }
    ]);

    setForm({
      nis: "",
      name: "",
      kelas: ""
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
      setStudents(students.filter((item) => item.id !== id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus SELURUH data siswa? Ini akan mengosongkan daftar absensi dan data master.")) {
      setStudents([]);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (!jsonData.length) {
        alert("File kosong atau format salah.");
        return;
      }

      const formattedData = jsonData.map((item) => ({
        id: Date.now() + Math.random(),
        nis: String(item.NIS || item.nis || ""),
        name: item.Nama || item.nama || item["Nama Lengkap"] || "",
        kelas: item.Kelas || item.kelas || "",
        status: "Hadir"
      }));

      // Filter out invalid or duplicate NIS (if existing in current list)
      const validData = formattedData.filter(newItem =>
        newItem.nis && newItem.name && newItem.kelas &&
        !students.find(s => s.nis === newItem.nis)
      );

      setStudents([...students, ...validData]);
      alert(`${validData.length} Data siswa berhasil diimport!`);
    };
    reader.readAsBinaryString(file);
  };

  const exportTemplate = () => {
    const template = [
      { NIS: "12345", Nama: "Ahmad Bagus", Kelas: "VII. 1" },
      { NIS: "12346", Nama: "Siti Aminah", Kelas: "VII. 2" }
    ];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Template-Import-Siswa.xlsx");
  };

  const filteredStudents = students.filter(s =>
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.nis || "").includes(searchTerm) ||
    (s.kelas || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Data Siswa</h1>
            <p className="text-slate-500 mt-1">Kelola daftar siswa, NIS, dan pembagian kelas.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportTemplate}
              className="flex items-center justify-center gap-2 bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm"
            >
              <Download size={18} />
              Template Excel
            </button>
            <label className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all font-semibold cursor-pointer text-sm">
              <FileUp size={18} />
              Import Data
              <input type="file" accept=".xlsx, .xls" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
              <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                  <UserPlus className="text-indigo-500" size={20} />
                  Tambah Siswa
                </h2>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Masukkan nama lengkap..."
                      value={form.name}
                      onChange={handleChange}
                      className="bg-white border border-slate-200 text-slate-700 p-3 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Nomor Induk (NIS)</label>
                    <input
                      type="text"
                      name="nis"
                      placeholder="Contoh: 12345678"
                      value={form.nis}
                      onChange={handleChange}
                      className="bg-white border border-slate-200 text-slate-700 p-3 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Pilih Kelas</label>
                    <select
                      name="kelas"
                      value={form.kelas}
                      onChange={handleChange}
                      className="bg-white border border-slate-200 text-slate-700 p-3 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer text-sm"
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

                <button
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  Simpan Data Siswa
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Cari nama, NIS, atau kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h2 className="text-lg font-bold text-slate-700">Daftar Siswa</h2>
                <div className="flex items-center gap-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                    {filteredStudents.length} Siswa
                  </span>
                  {students.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 size={14} />
                      Hapus Semua
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4">No</th>
                      <th className="px-6 py-4">Nama Lengkap</th>
                      <th className="px-6 py-4">NIS</th>
                      <th className="px-6 py-4">Kelas</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center gap-2">
                            <GraduationCap size={40} className="text-slate-200" />
                            <p className="italic">Data siswa tidak ditemukan.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((item, i) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group text-sm">
                          <td className="px-6 py-4 text-slate-400 font-mono">
                            {String(i + 1).padStart(2, '0')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-700">{item.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono">
                              {item.nis || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-md border border-indigo-100 uppercase">
                              {item.kelas}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-slate-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-xl"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
