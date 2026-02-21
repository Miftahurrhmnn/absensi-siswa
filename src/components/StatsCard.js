import React from "react";

export default function StatsCard({ students }) {
  const hadir = students.filter(s => s.status === "Hadir").length;
  const izin = students.filter(s => s.status === "Izin").length;
  const sakit = students.filter(s => s.status === "Sakit").length;
  const alpha = students.filter(s => s.status === "Alpha").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card title="Hadir" value={hadir} color="bg-green-500" />
      <Card title="Izin" value={izin} color="bg-yellow-500" />
      <Card title="Sakit" value={sakit} color="bg-blue-500" />
      <Card title="Alpha" value={alpha} color="bg-red-500" />
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`${color} text-white p-4 rounded-xl shadow`}>
      <h3 className="text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}