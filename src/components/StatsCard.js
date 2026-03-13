import React, { useState, useEffect } from "react";
import { Users, BookOpen, UserCheck, UserX, Clock, AlertCircle } from "lucide-react";

export default function StatsCard({ students }) {
  const [totalJurnal, setTotalJurnal] = useState(0);

  useEffect(() => {
    // We only need to sync the journal count from localStorage
    // The student count is reactively passed via props
    const savedJurnal = localStorage.getItem("jurnalData");
    setTotalJurnal(savedJurnal ? JSON.parse(savedJurnal).length : 0);
  }, []);

  const hadir = students.filter(s => s.status === "Hadir").length;
  const izin = students.filter(s => s.status === "Izin").length;
  const sakit = students.filter(s => s.status === "Sakit").length;
  const alpha = students.filter(s => s.status === "Alpha").length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5 transition-all hover:shadow-md hover:border-indigo-200">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Database Siswa</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{students.length} <span className="text-sm font-medium text-slate-400">Siswa</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5 transition-all hover:shadow-md hover:border-emerald-200">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Riwayat Jurnal</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{totalJurnal} <span className="text-sm font-medium text-slate-400">Entri</span></h3>
          </div>
        </div>
      </div>

      {/* Attendance Detail */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6 ml-2">
          <UserCheck className="text-indigo-500" size={20} />
          <h2 className="text-lg font-bold text-slate-700">Ringkasan Absensi Hari Ini</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SmallCard
            title="Hadir"
            value={hadir}
            icon={<UserCheck size={18} />}
            color="indigo"
          />
          <SmallCard
            title="Izin"
            value={izin}
            icon={<Clock size={18} />}
            color="amber"
          />
          <SmallCard
            title="Sakit"
            value={sakit}
            icon={<AlertCircle size={18} />}
            color="blue"
          />
          <SmallCard
            title="Alpha"
            value={alpha}
            icon={<UserX size={18} />}
            color="rose"
          />
        </div>
      </div>
    </div>
  );
}

function SmallCard({ title, value, icon, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <div className={`p-5 rounded-2xl border ${colors[color]} transition-all hover:scale-[1.03] cursor-default`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-[11px] font-black uppercase tracking-widest opacity-80">{title}</h3>
      </div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}