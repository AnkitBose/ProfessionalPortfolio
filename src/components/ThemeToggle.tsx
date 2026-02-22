import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const storageKey = "portfolio-theme";

const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
    root.classList.remove("light");
  }
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      applyTheme(stored);
      return;
    }

    applyTheme("dark");
  }, []);

  const toggleTheme = (): void => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="focus-ring rounded-md border border-border px-3 py-2 text-sm text-muted transition hover:text-text"
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

