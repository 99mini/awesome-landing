import { useEffect, useState } from "react";
import type { ControlValues } from "../types.ts";
import { SevenSegment } from "./seven-segment.tsx";
import * as css from "./demo.css.ts";

function now() {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

export default function Demo({ ghost, skew }: ControlValues) {
  const [time, setTime] = useState(now);

  useEffect(() => {
    const id = setInterval(() => setTime(now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={css.display}>
      <SevenSegment value={time} ghost={ghost !== 0} skew={skew} height={56} />
    </div>
  );
}
