"use client";

import Loading from "@/app/loading";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaMoon, FaSun } from "react-icons/fa";
import { FiMonitor } from "react-icons/fi";

type ThemeIcons = {
  icon: IconType;
  label: "light" | "dark" | "system";
};

const icons: ThemeIcons[] = [
  {
    icon: FaSun,
    label: "light",
  },
  {
    icon: FaMoon,
    label: "dark",
  },
  {
    icon: FiMonitor,
    label: "system",
  },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);

    return () => {
      setmounted(false);
    };
  }, []);

  if (!mounted) return <div />;

  return (
    <div className="flex w-max overflow-hidden rounded-md border bg-accent ">
      {icons.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          onClick={() => setTheme(label)}
          className={`rounded-sm p-2 transition-colors cursor-pointer ${
            theme === label ? "bg-card shadow-sm" : "hover:bg-card/50"
          }`}
        >
          <Icon className="size-4 fill-primary" />
        </button>
      ))}
    </div>
  );
}
