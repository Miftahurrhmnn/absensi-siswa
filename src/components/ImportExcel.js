import React from "react";
import * as XLSX from "xlsx";

export default function ImportExcel({ setStudents, students }) {

  const handleFileUpload = (e) => {
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
        name: item.Nama || item.nama,
        kelas: item.Kelas || item.kelas,
        status: "Hadir"
      }));

      // Gabungkan dengan data lama tanpa duplicate nama
      const combined = [...students];

      formattedData.forEach((newStudent) => {
        const exists = combined.find(
          (s) =>
            s.name === newStudent.name &&
            s.kelas === newStudent.kelas
        );

        if (!exists) {
          combined.push(newStudent);
        }
      });

      setStudents(combined);

      alert("Import berhasil!");
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <label className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition">
        Import Excel
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
}