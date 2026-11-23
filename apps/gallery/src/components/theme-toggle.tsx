import { useState } from "react";
import { Monitor, Moon, Sun } from "./icons.tsx";
import * as css from "./theme-toggle.css.ts";

type Theme = "system" | "light" | "dark";

const KEY = "al-theme";
const ORDER: Theme[] = ["system", "light", "dark"];
const LABEL: Record<Theme, string> = { system: "System", light: "Light", dark: "Dark" };
const ICON = { system: Monitor, light: Sun, dark: Moon };

/** 저장된 선택 — 저장소를 못 쓰면(사생활 보호 창 등) 시스템을 따른다 */
function stored(): Theme {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
  try {
    if (theme === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  } catch {
    // 저장은 편의 기능 — 실패해도 이번 방문에는 적용된다
  }
}

/**
 * 시스템 → 라이트 → 다크 순서로 바꾼다. 첫 화면에서 깜빡이지 않도록
 * 저장된 선택은 index.html 의 짧은 스크립트가 그리기 전에 먼저 적용한다.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(stored);
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]!;
  const Icon = ICON[theme];

  return (
    <button
      type="button"
      className={css.button}
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[next]}`}
      onClick={() => {
        apply(next);
        setTheme(next);
      }}
    >
      <Icon className={css.icon} />
      <span className={css.label}>{LABEL[theme]}</span>
    </button>
  );
}
