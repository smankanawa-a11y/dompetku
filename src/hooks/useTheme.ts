import { useCallback, useEffect, useState } from "react";
import { db, ensureSettings } from "@/services/db";
import type { ThemeMode } from "@/types/settings";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    ensureSettings()
      .then((settings) => {
        if (!isMounted) return;
        setThemeState(settings.theme);
        applyThemeClass(settings.theme);
      })
      .catch((err) => console.error("Gagal memuat pengaturan tema:", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const applyThemeClass = (mode: ThemeMode) => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  };

  const toggleTheme = useCallback(async () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    applyThemeClass(next);
    try {
      const settings = await ensureSettings();
      if (settings.id) await db.settings.update(settings.id, { theme: next });
    } catch (err) {
      console.error("Gagal menyimpan tema:", err);
    }
  }, [theme]);

  return { theme, toggleTheme, isLoading };
}
