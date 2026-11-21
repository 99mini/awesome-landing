import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useState } from "react";
import type { ControlValues } from "../types.ts";
import * as css from "./demo.css.ts";
import { useTransitionName, useViewTransition } from "./view-transition.tsx";
import * as vt from "./view-transition.css.ts";

const TILES = [
  { key: "one", label: "One" },
  { key: "two", label: "Two" },
  { key: "three", label: "Three" },
  { key: "four", label: "Four" },
] as const;

export default function Demo({ duration }: ControlValues) {
  const transition = useViewTransition(duration);
  const name = useTransitionName();
  const [mode, setMode] = useState<"grid" | "list">("grid");
  const [order, setOrder] = useState<readonly (typeof TILES)[number][]>(TILES);

  return (
    <div className={css.root}>
      <div className={css.toolbar}>
        <button
          type="button"
          className={css.button}
          onClick={() => transition(() => setMode((m) => (m === "grid" ? "list" : "grid")))}
        >
          {mode === "grid" ? "Show as list" : "Show as grid"}
        </button>
        <button
          type="button"
          className={css.button}
          // 마지막 칸을 맨 앞으로 — 매번 같은 순서로 돌아서 결과를 예측할 수 있다
          onClick={() => transition(() => setOrder((o) => [o.at(-1)!, ...o.slice(0, -1)]))}
        >
          Rotate
        </button>
      </div>
      <div className={css.layout[mode]}>
        {order.map((t) => (
          <div
            key={t.key}
            className={`${vt.named} ${css.tile} ${css.size[mode]} ${css.tone[t.key]}`}
            style={assignInlineVars({ [vt.nameVar]: name(t.key) })}
          >
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}
