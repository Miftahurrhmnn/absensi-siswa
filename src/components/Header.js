import React from "react";
import { Menu, LogOut } from "lucide-react";

export default function Header({ toggleSidebar, user, setUser }) {

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">

      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold text-slate-700">
          Dashboard Guru
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.mapel}</p>
        </div>

        <button
          onClick={handleLogout}
          className="text-rose-500 hover:text-rose-600"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}