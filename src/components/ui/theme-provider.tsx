"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type Attribute = "class" | `data-${string}`;

type ThemeContextValue = {
  resolvedTheme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  systemTheme: "light" | "dark";
  theme: string;
  themes: string[];
};

type ThemeProviderProps = React.PropsWithChildren<{
  attribute?: Attribute;
  defaultTheme?: Theme;
  disableTransitionOnChange?: boolean;
  enableSystem?: boolean;
  storageKey?: string;
}>;

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(storageKey: string, defaultTheme: Theme) {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme;
  }

  return defaultTheme;
}

function disableTransitions() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode("*{transition:none!important}")
  );
  document.head.appendChild(style);

  return () => {
    window.getComputedStyle(document.body);
    style.remove();
  };
}

function applyTheme(attribute: Attribute, resolvedTheme: "light" | "dark") {
  const root = document.documentElement;

  root.style.colorScheme = resolvedTheme;

  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    return;
  }

  root.setAttribute(attribute, resolvedTheme);
}

export function ThemeProvider({
  attribute = "class",
  children,
  defaultTheme = "system",
  disableTransitionOnChange = false,
  enableSystem = true,
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme)
  );
  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">(() =>
    getSystemTheme()
  );
  const resolvedTheme =
    theme === "system" && enableSystem ? systemTheme : theme === "dark" ? "dark" : "light";

  const setTheme = React.useCallback<React.Dispatch<React.SetStateAction<string>>>(
    (nextTheme) => {
      setThemeState((currentTheme) => {
        const value =
          typeof nextTheme === "function" ? nextTheme(currentTheme) : nextTheme;
        const normalizedTheme: Theme =
          value === "dark" || value === "light" || value === "system"
            ? value
            : defaultTheme;

        window.localStorage.setItem(storageKey, normalizedTheme);
        return normalizedTheme;
      });
    },
    [defaultTheme, storageKey]
  );

  React.useLayoutEffect(() => {
    const restoreTransitions = disableTransitionOnChange
      ? disableTransitions()
      : undefined;

    applyTheme(attribute, resolvedTheme);
    restoreTransitions?.();
  }, [attribute, disableTransitionOnChange, resolvedTheme]);

  React.useEffect(() => {
    if (!enableSystem) {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      setSystemTheme(media.matches ? "dark" : "light");
    };

    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [enableSystem]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      resolvedTheme,
      setTheme,
      systemTheme,
      theme,
      themes: enableSystem ? ["light", "dark", "system"] : ["light", "dark"],
    }),
    [enableSystem, resolvedTheme, setTheme, systemTheme, theme]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = React.use(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return context;
}
