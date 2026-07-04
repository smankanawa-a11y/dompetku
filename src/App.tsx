import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "@/components/ui/Toast";
import Dashboard from "@/views/Dashboard";
import Pemasukan from "@/views/Pemasukan";
import Pengeluaran from "@/views/Pengeluaran";
import Hutang from "@/views/Hutang";
import LaporanHarian from "@/views/laporan/LaporanHarian";
import LaporanBulanan from "@/views/laporan/LaporanBulanan";
import LaporanTahunan from "@/views/laporan/LaporanTahunan";
import Pengaturan from "@/views/Pengaturan";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pemasukan" element={<Pemasukan />} />
          <Route path="/pengeluaran" element={<Pengeluaran />} />
          <Route path="/hutang" element={<Hutang />} />
          <Route path="/laporan/harian" element={<LaporanHarian />} />
          <Route path="/laporan/bulanan" element={<LaporanBulanan />} />
          <Route path="/laporan/tahunan" element={<LaporanTahunan />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
