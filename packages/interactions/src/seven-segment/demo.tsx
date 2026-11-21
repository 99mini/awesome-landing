import { useEffect, useState } from "react";
import type { ControlValues, InteractionMeta } from "../types.ts";
import { SevenSegment } from "./seven-segment.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "seven-segment",
  title: "Seven Segment",
  description: "세그먼트가 켜지고 꺼지며 바뀌는 7세그먼트 디스플레이. 꺼진 세그먼트 잔상 표현",
  category: "text",
  tags: ["SVG", "animate", "LCD"],
  replayable: false,
  controls: {
    ghost: { label: "Ghost", kind: "toggle", min: 0, max: 1, step: 1, default: 1 },
    skew: { label: "Skew", min: 0, max: 14, step: 1, default: 6, unit: "°" },
  },
};

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
