import { useRef, useState } from "react";
import type { ControlValues } from "../types.ts";
import * as css from "./demo.css.ts";
import { ToastStack, type Toast } from "./toast-stack.tsx";

// 본문은 한 줄로 — 겹쳐 쌓일 때 알림 높이가 같아야 뒤 알림이 고르게 비어져 나온다
const MESSAGES = [
  { title: "Draft saved", body: "Stored on this device." },
  { title: "Link copied", body: "Paste it anywhere to share." },
  { title: "Theme updated", body: "New colors on every page." },
  { title: "Upload finished", body: "The file is ready to use." },
];

export default function Demo({ duration = 4, limit = 3, stack = 1 }: ControlValues) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);

  function notify() {
    const n = next.current++;
    setToasts((all) => [...all, { id: n, ...MESSAGES[n % MESSAGES.length]! }]);
  }

  return (
    <div className={css.root}>
      <button type="button" className={css.button} onClick={notify}>
        Notify
      </button>
      <ToastStack
        className={css.stack}
        toastClassName={css.toast}
        toasts={toasts}
        duration={duration}
        limit={limit}
        collapse={stack === 1}
        onDismiss={(id) => setToasts((all) => all.filter((t) => t.id !== id))}
      />
      <p className={css.status}>
        {toasts.length > limit
          ? `${toasts.length - limit} older hidden`
          : stack === 1
            ? "Hover or focus the stack to fan it out"
            : duration
              ? "Hover or focus the stack to keep them"
              : "Dismiss each one by hand"}
      </p>
    </div>
  );
}
