import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "🏠", end: true },
  { to: "/pemasukan", label: "Pemasukan", icon: "💵" },
  { to: "/pengeluaran", label: "Pengeluaran", icon: "🧾" },
  { to: "/hutang", label: "Hutang", icon: "📋" },
  { to: "/laporan/harian", label: "Laporan Harian", icon: "📅" },
  { to: "/laporan/bulanan", label: "Laporan Bulanan", icon: "🗓️" },
  { to: "/laporan/tahunan", label: "Laporan Tahunan", icon: "📈" },
  { to: "/pengaturan", label: "Pengaturan", icon: "⚙️" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:flex md:flex-col">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="text-2xl">💰</span>
        <span className="text-lg font-bold">Dompetku</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-balance/10 text-balance"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`
            }
          >
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
