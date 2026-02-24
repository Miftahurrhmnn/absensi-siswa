import React, { useState } from "react";
import { User, Lock, LogIn, AlertCircle } from "lucide-react";

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
      setError("Username atau password yang Anda masukkan salah.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(foundUser));
    setUser(foundUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50 select-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50 select-none"></div>

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 rounded-3xl border border-white p-8 md:p-10 space-y-8">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3">
              <LogIn className="text-white w-8 h-8 -rotate-3" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Login Portal Guru</h1>
              <p className="text-slate-500 text-sm mt-1">MTS Negeri 12 Jakarta</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 text-sm p-4 rounded-2xl">
              <AlertCircle size={18} className="shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Masukkan username Anda"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 pl-11 pr-4 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 pl-11 pr-4 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              Masuk Sekarang
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400 font-medium">
              &copy; 2026 MTS Negeri 12 Jakarta. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}