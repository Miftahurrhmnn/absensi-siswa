import React, { useState } from "react";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const accounts = [
    {
      username: "rahman",
      password: "12345",
      name: "Rahman, S.Pd",
      mapel: "Matematika"
    },
    {
      username: "fitri",
      password: "12345",
      name: "Fitri, S.Pd",
      mapel: "Bahasa Inggris"
    }
  ];

  const handleLogin = () => {
    const foundUser = accounts.find(
      (acc) =>
        acc.username === username &&
        acc.password === password
    );

    if (!foundUser) {
      setError("Username atau Password salah!");
      return;
    }

    // Simpan ke localStorage
    localStorage.setItem("user", JSON.stringify(foundUser));

    // Update state di App
    setUser(foundUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-80 space-y-4">

        <h2 className="text-xl font-semibold text-center text-indigo-600">
          Login Guru
        </h2>

        {error && (
          <div className="bg-rose-100 text-rose-600 text-sm p-2 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded-lg"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Masuk
        </button>

      </div>
    </div>
  );
}