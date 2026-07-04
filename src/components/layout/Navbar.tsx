import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/pemasukan", label: "Pemasukan" },
  { to: "/pengeluaran", label: "Pengeluaran" },
  { to: "/hutang", label: "Hutang" },
  { to: "/laporan/harian", label: "Laporan Harian" },
  { to: "/laporan/bulanan", label: "Laporan Bulanan" },
  { to: "/laporan/tahunan", label: "Laporan Tahunan" },
  { to: "/pengaturan", label: "Pengaturan" },
];

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Buka menu navigasi"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <ThemeToggle />
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-gray-200 p-3 dark:border-gray-800 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-balance/10 text-balance"
                    : "text-gray-600 dark:text-gray-300"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
