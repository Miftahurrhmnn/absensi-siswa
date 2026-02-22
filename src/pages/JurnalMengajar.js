import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function JurnalMengajar({ user }) {
  const [jurnal, setJurnal] = useState([]);
  const [form, setForm] = useState({
    hari: "",
    tanggal: "",
    kelas: "",
    jam: "",
    pertemuan: "",
    materi: ""
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
    const data = jurnal.map((item, index) => ({
      No: index + 1,
      Hari: item.hari,
      Tanggal: item.tanggal,
      Kelas: item.kelas,
      Jam: item.jam,
      Pertemuan: item.pertemuan,
      Materi: item.materi
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

  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-screen">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Info */}
        <div className="bg-white rounded-xl shadow p-4">
          <p><strong>Nama Guru:</strong> {user?.name}</p>
          <p><strong>Mata Pelajaran:</strong> {user?.mapel}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">

          <h2 className="text-xl font-semibold text-indigo-600">
            Jurnal Mengajar
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <select
              name="hari"
              value={form.hari}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            >
              <option value="">Pilih Hari</option>
              <option>Senin</option>
              <option>Selasa</option>
              <option>Rabu</option>
              <option>Kamis</option>
              <option>Jumat</option>
              <option>Sabtu</option>
            </select>

            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              name="kelas"
              placeholder="Kelas"
              value={form.kelas}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="jam"
              placeholder="Jam Ke"
              value={form.jam}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              name="pertemuan"
              placeholder="Pertemuan Ke"
              value={form.pertemuan}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              name="materi"
              placeholder="Materi"
              value={form.materi}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Simpan Jurnal
            </button>

            <button
              onClick={exportExcel}
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-indigo-500 text-white">
                <th className="p-2">No</th>
                <th className="p-2">Hari</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Kelas</th>
                <th className="p-2">Jam</th>
                <th className="p-2">Pert</th>
                <th className="p-2">Materi</th>
              </tr>
            </thead>
            <tbody>
              {jurnal.map((item, i) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{item.hari}</td>
                  <td className="p-2">{item.tanggal}</td>
                  <td className="p-2">{item.kelas}</td>
                  <td className="p-2">{item.jam}</td>
                  <td className="p-2">{item.pertemuan}</td>
                  <td className="p-2">{item.materi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}