import { useRef, useState } from "react";
import type { ControlValues } from "../types.ts";
import * as css from "./demo.css.ts";
import { ToastStack, type Toast } from "./toast-stack.tsx";

const MESSAGES = [
  { title: "Draft saved", body: "Your changes are stored on this device." },
  { title: "Link copied", body: "Paste it anywhere to share this view." },
  { title: "Theme updated", body: "The new colors apply to every page." },
  { title: "Upload finished", body: "The file is ready to use." },
];

export default function Demo({ duration = 4, limit = 3 }: ControlValues) {
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
        onDismiss={(id) => setToasts((all) => all.filter((t) => t.id !== id))}
      />
      <p className={css.status}>
        {toasts.length > limit
          ? `${toasts.length - limit} more waiting`
          : duration
            ? "Hover or focus the stack to keep them"
            : "Dismiss each one by hand"}
      </p>
    </div>
  );
}
