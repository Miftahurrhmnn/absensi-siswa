import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Users,
  BookOpen,
  FileText,
  Trash2,
  Download,
  PlusCircle,
  CheckCircle2,
  UserX,
} from "lucide-react";

export default function JurnalMengajar() {
  const [jurnal, setJurnal] = useState([]);
  const [form, setForm] = useState({
    hari: "",
    tanggal: "",
    kelas: "",
    jam: "",
    pertemuan: "",
    materi: "",
    keterangan: "",
    jmlHadir: "",
    jmlAbsen: ""
  });

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem("jurnalData");
    if (saved) setJurnal(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("jurnalData", JSON.stringify(jurnal));
  }, [jurnal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validasi angka untuk jumlah siswa
    if (name === "jmlHadir" || name === "jmlAbsen") {
      if (value === "" || /^[0-9]*$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (!form.hari || !form.tanggal || !form.kelas || !form.materi) {
      alert("Lengkapi data Hari, Tanggal, Kelas, dan Materi!");
      return;
    }

    setJurnal([
      { id: Date.now(), ...form },
      ...jurnal
    ]);

    setForm({
      hari: "",
      tanggal: "",
      kelas: "",
      jam: "",
      pertemuan: "",
      materi: "",
      keterangan: "",
      jmlHadir: "",
      jmlAbsen: ""
    });
  };

  const exportExcel = () => {
    if (jurnal.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    const data = jurnal.map((item, index) => ({
      No: index + 1,
      Hari: item.hari,
      Tanggal: item.tanggal,
      Kelas: item.kelas,
      Jam: item.jam,
      Pertemuan: item.pertemuan,
      "Materi Pokok": item.materi,
      "Jml Hadir": item.jmlHadir || 0,
      "Jml Absen": item.jmlAbsen || 0,
      Keterangan: item.keterangan
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jurnal Mengajar");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Jurnal-Mengajar-Lengkap.xlsx");
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus catatan jurnal ini?")) {
      setJurnal(jurnal.filter((item) => item.id !== id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Hapus SELURUH riwayat jurnal?")) {
      setJurnal([]);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <BookOpen className="text-indigo-600" size={36} />
              Jurnal Mengajar
            </h1>
            <p className="text-slate-500 font-medium ml-1">Administrasi harian guru MTS Negeri 12 Jakarta</p>
          </div>
          <button
            onClick={exportExcel}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all font-bold active:scale-95"
          >
            <Download size={20} />
            Export Laporan
          </button>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 px-8 py-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-3">
              <PlusCircle size={22} />
              Buat Catatan Baru
            </h2>
            <div className="px-3 py-1 bg-indigo-500 text-indigo-100 rounded-full text-xs font-bold uppercase tracking-widest">
              Semester Ganjil
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Hari</label>
                    <select
                      name="hari"
                      value={form.hari}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="">Pilih Hari</option>
                      <option>Senin</option><option>Selasa</option><option>Rabu</option>
                      <option>Kamis</option><option>Jumat</option><option>Sabtu</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Tanggal</label>
                    <input
                      type="date"
                      name="tanggal"
                      value={form.tanggal}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Kelas</label>
                    <select
                      name="kelas"
                      value={form.kelas}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="">Kelas</option>
                      <option>VII. 1</option><option>VII. 2</option>
                      <option>VIII. 1</option><option>IX. 1</option><option>IX. 6</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Jam Ke-</label>
                    <select
                      name="jam"
                      value={form.jam}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700"
                    >
                      <option value="">Jam</option>
                      {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Pertemuan</label>
                    <select
                      name="pertemuan"
                      value={form.pertemuan}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700"
                    >
                      <option value="">Per-</option>
                      {[...Array(25)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                  </div>
                </div>

                {/* Siswa Stats Section */}
                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200">
                  <h3 className="text-xs font-black uppercase text-slate-500 mb-4 flex items-center gap-2">
                    <Users size={14} /> Kehadiran Siswa
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Jml Hadir
                      </label>
                      <input
                        type="text"
                        name="jmlHadir"
                        placeholder="0"
                        value={form.jmlHadir}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-slate-100 p-3 rounded-2xl focus:border-emerald-500 outline-none text-center font-black text-emerald-600 text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                        <UserX size={12} /> Jml Absen
                      </label>
                      <input
                        type="text"
                        name="jmlAbsen"
                        placeholder="0"
                        value={form.jmlAbsen}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-slate-100 p-3 rounded-2xl focus:border-rose-500 outline-none text-center font-black text-rose-600 text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Descriptions */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                    <BookOpen size={14} /> Materi Pokok Pelajaran
                  </label>
                  <input
                    type="text"
                    name="materi"
                    placeholder="Contoh: Operasi Hitung Campuran"
                    value={form.materi}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-3xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                    <FileText size={14} /> Deskripsi Kegiatan Pembelajaran
                  </label>
                  <textarea
                    name="keterangan"
                    rows="6"
                    placeholder="Tuliskan aktivitas yang dilakukan di kelas secara ringkas..."
                    value={form.keterangan}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-[2rem] outline-none focus:border-indigo-500 transition-all font-medium text-slate-600 shadow-inner resize-none"
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <PlusCircle size={24} />
                  Simpan Jurnal Baru
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-slate-800">Riwayat Catatan</h2>
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full">
                {jurnal.length} Catatan
              </div>
              {jurnal.length > 0 && (
                <button onClick={handleClearAll} className="text-sm font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5">
                  <Trash2 size={16} /> Hapus Semua
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jurnal.length === 0 ? (
              <div className="md:col-span-2 bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <FileText size={40} className="text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold italic text-lg tracking-tight">Belum ada catatan jurnal mengajar yang tersimpan.</p>
              </div>
            ) : (
              jurnal.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-lg shadow-slate-200/40 border border-white hover:border-indigo-100 transition-all group relative">
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100">
                        {item.hari}, {item.tanggal}
                      </span>
                      <span className="bg-slate-50 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-slate-100">
                        Kelas {item.kelas}
                      </span>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="text-slate-200 hover:text-rose-500 transition-colors p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-indigo-100">
                        <span className="text-xs font-black text-indigo-600 leading-none">{item.jam}</span>
                        <span className="text-[8px] font-bold text-indigo-400 uppercase">Jam</span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg leading-snug group-hover:text-indigo-600 transition-colors">{item.materi}</h4>
                        <p className="text-slate-400 text-xs font-bold mt-1">Pertemuan Ke-{item.pertemuan}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                        {item.keterangan || "Tidak ada deskripsi kegiatan."}
                      </p>
                    </div>

                    {/* Stats Footer */}
                    <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[11px] font-black uppercase tracking-wider">{item.jmlHadir || 0} Hadir</span>
                      </div>
                      <div className="flex items-center gap-2 text-rose-500">
                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                        <span className="text-[11px] font-black uppercase tracking-wider">{item.jmlAbsen || 0} Absen</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}