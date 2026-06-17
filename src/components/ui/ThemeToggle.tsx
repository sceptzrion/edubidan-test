"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const THEME_STORAGE_KEY = "edubidan-theme";

type ThemeMode = "light" | "dark";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

function applyThemeClass(theme: ThemeMode) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    return;
  }

  document.documentElement.classList.remove("dark");
}

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function getSnapshot() {
  const theme = getStoredTheme();

  if (typeof window !== "undefined") {
    applyThemeClass(theme);
  }

  return theme;
}

function getServerSnapshot(): ThemeMode {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isDark = theme === "dark";

  const toggleTheme = () => {
    const nextTheme: ThemeMode = isDark ? "light" : "dark";

    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyThemeClass(nextTheme);

    window.dispatchEvent(new StorageEvent("storage"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
      title={isDark ? "Mode Terang" : "Mode Gelap"}
    >
      {isDark ? (
        <Sun size={20} className="text-amber-500" />
      ) : (
        <Moon size={20} className="text-muted-foreground" />
      )}
    </button>
  );
}