import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Calculator, FileDown, Search, Filter, AlertCircle, CheckCircle2, Calendar, BookOpen } from "lucide-react";

export default function NilaiSiswa() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [formatType, setFormatType] = useState("Formatif");
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [semester, setSemester] = useState("Ganjil");
  const [kktp, setKktp] = useState(75);
  const [grades, setGrades] = useState({}); // Key: studentId-formatType, Value: { scores: [], avg: 0 }
  const [searchTerm, setSearchTerm] = useState("");

  // Load data
  useEffect(() => {
    const savedStudents = localStorage.getItem("dataSiswa");
    if (savedStudents) setStudents(JSON.parse(savedStudents));

    const savedGrades = localStorage.getItem("nilaiSiswa");
    if (savedGrades) setGrades(JSON.parse(savedGrades));

    const savedKktp = localStorage.getItem("kktp_config");
    if (savedKktp) setKktp(Number(savedKktp));

    const savedYear = localStorage.getItem("academicYear");
    if (savedYear) setAcademicYear(savedYear);

    const savedSemester = localStorage.getItem("semester");
    if (savedSemester) setSemester(savedSemester);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("nilaiSiswa", JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem("kktp_config", kktp.toString());
  }, [kktp]);

  useEffect(() => {
    localStorage.setItem("academicYear", academicYear);
  }, [academicYear]);

  useEffect(() => {
    localStorage.setItem("semester", semester);
  }, [semester]);

  const handleScoreChange = (studentId, index, value) => {
    const numValue = value === "" ? "" : Math.min(100, Math.max(0, Number(value)));
    const key = `${studentId}-${formatType}`;

    setGrades(prev => {
      const currentEntry = prev[key] || { scores: Array(6).fill(""), avg: 0 };
      const newScores = [...currentEntry.scores];
      newScores[index] = numValue;

      // Calculate new average (only count inputs that are not empty)
      const filledScores = newScores.filter(s => s !== "" && s !== null);
      const sum = filledScores.reduce((a, b) => a + b, 0);
      const avg = filledScores.length > 0 ? (sum / filledScores.length).toFixed(1) : 0;

      return {
        ...prev,
        [key]: { scores: newScores, avg: Number(avg) }
      };
    });
  };

  const getStudentGradeData = (studentId) => {
    const key = `${studentId}-${formatType}`;
    return grades[key] || { scores: Array(6).fill(""), avg: 0 };
  };

  const exportExcel = () => {
    const currentStudents = students.filter(s =>
      (!selectedClass || s.kelas === selectedClass) &&
      (s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (currentStudents.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    // Header metadata for the "Headline"
    const headerMetadata = [
      ["LAPORAN PENILAIAN SISWA"],
      [`Format Nilai: ${formatType}`],
      [`Tahun Pelajaran: ${academicYear}`],
      [`Semester: ${semester}`],
      [`Kelas: ${selectedClass || "Semua Kelas"}`],
      [`KKTP: ${kktp}`],
      [], // Empty row before table
    ];

    const tableData = currentStudents.map((s, i) => {
      const gradeData = getStudentGradeData(s.id);
      const row = {
        No: i + 1,
        NIS: s.nis,
        Nama: s.name,
        Kelas: s.kelas,
      };

      if (formatType === "ASAS & ASAT") {
        row["ASAS"] = gradeData.scores[0];
        row["ASAT"] = gradeData.scores[1];
      } else {
        const prefix = formatType === "Formatif" ? "F" : "S";
        for (let j = 0; j < 6; j++) {
          row[`${prefix}${j + 1}`] = gradeData.scores[j];
        }
      }

      row["Rata-rata"] = gradeData.avg;
      row["Status"] = gradeData.avg >= kktp ? "Tuntas" : "Perlu Bimbingan";

      return row;
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(headerMetadata);

    // Append table data starting after metadata
    XLSX.utils.sheet_add_json(worksheet, tableData, {
      origin: `A${headerMetadata.length + 1}`,
      skipHeader: false
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Penilaian");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const fileName = `Nilai_${formatType.replace(/\s/g, '_')}_${academicYear.replace(/\//g, '-')}_${semester}_${selectedClass || "Semua"}.xlsx`;
    saveAs(blob, fileName);
  };

  const filteredStudents = students.filter(s =>
    (!selectedClass || s.kelas === selectedClass) &&
    ((s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (s.nis || "").includes(searchTerm))
  );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Penilaian Siswa</h1>
            <p className="text-slate-500 mt-1">Input dan monitoring hasil belajar siswa secara real-time.</p>
          </div>
          <button
            onClick={exportExcel}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all font-semibold"
          >
            <FileDown size={18} />
            Export Nilai
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Format Nilai */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Calculator size={14} /> Format Nilai
              </label>
              <select
                value={formatType}
                onChange={(e) => setFormatType(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option>Formatif</option>
                <option>Sumatif</option>
                <option>ASAS & ASAT</option>
              </select>
            </div>

            {/* Tahun Pelajaran */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Calendar size={14} /> Tahun Pelajaran
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option>2024/2025</option>
                <option>2025/2026</option>
                <option>2026/2027</option>
              </select>
            </div>

            {/* Semester */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <BookOpen size={14} /> Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option>Ganjil</option>
                <option>Genap</option>
              </select>
            </div>

            {/* Pilih Kelas */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Filter size={14} /> Pilih Kelas
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">Semua Kelas</option>
                <option>VII. 1</option>
                <option>VII. 2</option>
                <option>VIII. 1</option>
                <option>IX. 1</option>
                <option>IX. 6</option>
              </select>
            </div>

            {/* KKTP */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <AlertCircle size={14} /> Batas KKTP
              </label>
              <input
                type="number"
                value={kktp}
                onChange={(e) => setKktp(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-black text-indigo-600 text-center"
              />
            </div>
          </div>

          {/* Search Table */}
          <div className="relative group pt-2">
            <Search className="absolute left-4 top-[38px] text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Cari nama atau NIS siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5 sticky left-0 bg-slate-50 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.03)] min-w-[200px]">Informasi Siswa</th>

                  {formatType === "ASAS & ASAT" ? (
                    <>
                      <th className="px-4 py-5 text-center">ASAS</th>
                      <th className="px-4 py-5 text-center">ASAT</th>
                    </>
                  ) : (
                    [...Array(6)].map((_, i) => (
                      <th key={i} className="px-4 py-5 text-center">
                        {formatType === "Formatif" ? `F${i + 1}` : `S${i + 1}`}
                      </th>
                    ))
                  )}

                  <th className="px-6 py-5 text-center">Rata-rata</th>
                  <th className="px-8 py-5">Status KKTP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-20 text-center text-slate-300 italic">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={48} className="text-slate-100" />
                        <p className="font-medium text-lg">Data siswa tidak ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const gradeData = getStudentGradeData(s.id);
                    const isBelowKktp = gradeData.avg < kktp && gradeData.avg > 0;
                    const isTuntas = gradeData.avg >= kktp;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                        <td className="px-8 py-6 sticky left-0 bg-white group-hover:bg-slate-50/80 z-10 shadow-[4px_0_10px_rgba(0,0,0,0.03)] transition-colors">
                          <div className="font-black text-slate-700 text-sm tracking-tight">{s.name}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-slate-400 py-0.5 px-2 bg-slate-100 rounded-md font-mono">{s.nis}</span>
                            <span className="text-[10px] font-bold text-indigo-400 py-0.5 px-2 bg-indigo-50 rounded-md uppercase tracking-tighter italic">{s.kelas}</span>
                          </div>
                        </td>

                        {(formatType === "ASAS & ASAT" ? [0, 1] : [...Array(6).keys()]).map((idx) => (
                          <td key={idx} className="px-2 py-6 text-center">
                            <input
                              type="number"
                              value={gradeData.scores[idx] === "" ? "" : gradeData.scores[idx]}
                              onChange={(e) => handleScoreChange(s.id, idx, e.target.value)}
                              className={`w-14 text-center p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-black text-sm transition-all ${gradeData.scores[idx] !== "" ? "bg-slate-50 text-slate-800 shadow-sm" : "bg-white"
                                }`}
                            />
                          </td>
                        ))}

                        <td className="px-6 py-6 text-center">
                          <div className={`text-sm font-black font-mono inline-flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm border-2 ${isTuntas ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                            isBelowKktp ? "text-rose-600 bg-rose-50 border-rose-100" : "text-slate-300 bg-slate-50 border-slate-100"
                            }`}>
                            {gradeData.avg}
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          {isTuntas ? (
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 py-2 px-4 rounded-xl border border-emerald-100 w-fit">
                              <CheckCircle2 size={16} />
                              <span className="text-[11px] font-black uppercase tracking-wider">Tuntas</span>
                            </div>
                          ) : isBelowKktp ? (
                            <div className="flex items-center gap-2 text-rose-600 bg-rose-50/50 py-2 px-4 rounded-xl border border-rose-100 w-fit">
                              <AlertCircle size={16} />
                              <span className="text-[11px] font-black uppercase tracking-wider">Bimbingan</span>
                            </div>
                          ) : (
                            <div className="text-slate-300 text-[11px] font-bold uppercase tracking-widest pl-2">Belum Ada</div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
