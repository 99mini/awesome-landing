import { useState } from "react";
import type { ControlValues } from "../types.ts";
import * as css from "./demo.css.ts";
import { NumberTicker } from "./number-ticker.tsx";

export default function Demo({ duration, stagger }: ControlValues) {
  const [value, setValue] = useState(1280);

  return (
    <div className={css.root}>
      <NumberTicker
        className={css.number}
        value={value}
        duration={duration}
        stagger={stagger}
        locale="en-US"
      />
      <div className={css.actions}>
        <button type="button" className={css.button} onClick={() => setValue((v) => v + 1)}>
          Add 1
        </button>
        <button type="button" className={css.button} onClick={() => setValue((v) => v + 250)}>
          Add 250
        </button>
        <button
          type="button"
          className={css.button}
          onClick={() => setValue(Math.floor(Math.random() * 100_000))}
        >
          Random
        </button>
      </div>
    </div>
  );
}
