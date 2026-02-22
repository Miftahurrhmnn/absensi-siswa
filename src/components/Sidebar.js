import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  X
} from "lucide-react";

export default function Sidebar({ open, close }) {
  return (
    <>
      {/* Overlay Mobile */}
      {open && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          bg-gradient-to-b from-indigo-700 to-indigo-600
          text-white w-64 h-full
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform duration-300 ease-in-out
          shadow-xl
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-indigo-500">
          <div>
            <h1 className="text-lg font-bold tracking-wide">
              MTs Negeri 12
            </h1>
            <p className="text-xs text-indigo-200">
              Admin Dashboard
            </p>
          </div>

          {/* Close Button (Mobile) */}
          <button onClick={close} className="md:hidden">
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">

          <NavLink
            exact
            to="/"
            activeClassName="bg-white text-indigo-700"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500 transition-all duration-200"
          >
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Absensi</span>
          </NavLink>

          <NavLink
            to="/jurnal"
            activeClassName="bg-white text-indigo-700"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500 transition-all duration-200"
          >
            <BookOpen size={20} />
            <span className="text-sm font-medium">
              Jurnal Mengajar
            </span>
          </NavLink>

        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 text-xs text-indigo-200 border-t border-indigo-500">
          © 2026 Sistem Guru
        </div>
      </aside>
    </>
  );
}