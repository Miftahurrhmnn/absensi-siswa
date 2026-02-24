import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function JurnalMengajar() {
  const [jurnal, setJurnal] = useState([]);
  const [form, setForm] = useState({
    hari: "",
    tanggal: "",
    kelas: "",
    jam: "",
    pertemuan: "",
    materi: "",
    keterangan: ""
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.hari || !form.tanggal || !form.kelas) {
      alert("Lengkapi data terlebih dahulu");
      return;
    }

    setJurnal([
      ...jurnal,
      { id: Date.now(), ...form }
    ]);

    setForm({
      hari: "",
      tanggal: "",
      kelas: "",
      jam: "",
      pertemuan: "",
      materi: ""
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
      Materi: item.materi,
      keterangan: item.keterangan
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jurnal Mengajar");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, "Jurnal-Mengajar.xlsx");
  };

  const handleDelete = (id) => {
    setJurnal(jurnal.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Jurnal Mengajar</h1>
            <p className="text-slate-500 mt-1">Catat dan kelola riwayat pengajaran harian Anda.</p>
          </div>
          <button
            onClick={exportExcel}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export ke Excel
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              Input Jurnal Baru
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Hari</label>
                <select
                  name="hari"
                  value={form.hari}
                  onChange={handleChange}
                  className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Pilih Hari</option>
                  <option>Senin</option>
                  <option>Selasa</option>
                  <option>Rabu</option>
                  <option>Kamis</option>
                  <option>Jumat</option>
                  <option>Sabtu</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Tanggal</label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Kelas</label>
                <select
                  name="kelas"
                  value={form.kelas}
                  onChange={handleChange}
                  className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Pilih Kelas</option>
                  <option>VII. 1</option>
                  <option>VII. 2</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Jam Ke-</label>
                <select
                  name="jam"
                  value={form.jam}
                  onChange={handleChange}
                  className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Pilih Jam</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Pertemuan Ke-</label>
                <select
                  name="pertemuan"
                  value={form.pertemuan}
                  onChange={handleChange}
                  className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Pilih Per-</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Materi</label>
                <input
                  type="text"
                  name="materi"
                  placeholder="Isi materi..."
                  value={form.materi}
                  onChange={handleChange}
                  className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Kegiatan</label>
                <input
                  type="text"
                  name="keterangan"
                  placeholder="Kegiatan mengajar..."
                  value={form.keterangan}
                  onChange={handleChange}
                  className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-10 py-3 rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all font-bold flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Simpan Jurnal
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-700">Riwayat Jurnal</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 font-medium">Total:</span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{jurnal.length} Data</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Informasi Kelas</th>
                  <th className="px-6 py-4">Sesi & Jam</th>
                  <th className="px-6 py-4">Detail Pengajaran</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jurnal.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">
                      Belum ada catatan jurnal mengajar.
                    </td>
                  </tr>
                ) : (
                  jurnal.map((item, i) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-6 align-top">
                        <span className="text-slate-300 font-bold font-mono text-lg leading-none">{String(i + 1).padStart(2, '0')}</span>
                      </td>
                      <td className="px-6 py-6 align-top">
                        <div className="font-bold text-slate-700">{item.hari}</div>
                        <div className="text-sm text-slate-400 font-medium mt-0.5">{item.tanggal}</div>
                        <div className="mt-2">
                          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-100 uppercase tracking-tight">Kls {item.kelas}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 align-top">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            <span className="text-sm font-semibold text-slate-600">Jam Ke-{item.jam}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-100"></span>
                            <span className="text-[13px] font-medium italic">Pertemuan {item.pertemuan}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 align-top max-w-sm">
                        <div className="font-semibold text-slate-700 leading-snug group-hover:text-indigo-600 transition-colors">{item.materi}</div>
                        <div className="text-sm text-slate-500 mt-1.5 line-clamp-2 italic leading-relaxed">{item.keterangan || "-"}</div>
                      </td>
                      <td className="px-6 py-6 text-center align-top">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-xl"
                          title="Hapus Jurnal"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
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
  );
}