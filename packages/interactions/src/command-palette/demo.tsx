import { m, useReducedMotion } from "motion/react";
import { useState } from "react";
import { CommandPalette, type Command } from "./command-palette.tsx";
import * as css from "./demo.css.ts";

const COMMANDS: Command[] = [
  { id: "round", label: "Make it round", hint: "Shape", keywords: ["circle"] },
  { id: "square", label: "Make it square", hint: "Shape" },
  { id: "yellow", label: "Use yellow", hint: "Color" },
  { id: "teal", label: "Use teal", hint: "Color", keywords: ["green", "blue"] },
  { id: "rotate", label: "Rotate a quarter turn", hint: "Transform", keywords: ["spin", "turn"] },
  { id: "reset", label: "Reset everything", hint: "General", keywords: ["clear", "undo"] },
];

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

export default function Demo() {
  const reduce = useReducedMotion();
  const [round, setRound] = useState(false);
  const [teal, setTeal] = useState(false);
  const [turns, setTurns] = useState(0);
  const [last, setLast] = useState("");

  function run(command: Command) {
    setLast(command.label);
    if (command.id === "round") setRound(true);
    if (command.id === "square") setRound(false);
    if (command.id === "yellow") setTeal(false);
    if (command.id === "teal") setTeal(true);
    if (command.id === "rotate") setTurns((t) => t + 1);
    if (command.id === "reset") {
      setRound(false);
      setTeal(false);
      setTurns(0);
    }
  }

  return (
    <div className={css.root}>
      <m.div
        className={`${css.tile} ${round ? css.round : ""} ${teal ? css.teal : css.yellow}`}
        animate={{ rotate: turns * 90 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }}
      />
      <CommandPalette
        commands={COMMANDS}
        onRun={run}
        hotkey="focus"
        panelClassName={css.panel}
        trigger={
          <span className={css.trigger}>
            Open commands
            <kbd className={css.kbd}>{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </span>
        }
      />
      <p className={css.status} aria-live="polite">
        {last ? `Ran "${last}"` : "Try typing rot, then Enter"}
      </p>
    </div>
  );
}
