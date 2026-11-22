import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../lib/cx.ts";
import * as css from "./command-palette.css.ts";

// 입력칸이 포커스를 갖고 aria-activedescendant 로 고른 줄을 알리는 combobox 패턴 —
// <dialog>·<select>·<option> 으로는 이 동작(걸러지는 목록, 입력칸 포커스 유지)을 만들 수 없다.
// 옵션의 키보드 조작은 입력칸이 대신 받는다
/* oxlint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/click-events-have-key-events */

export interface Command {
  id: string;
  label: string;
  /** 오른쪽에 흐리게 붙는 설명 (분류, 단축키 등) */
  hint?: string;
  /** label 에 없는 검색어 */
  keywords?: string[];
}

interface CommandPaletteProps {
  commands: Command[];
  onRun: (command: Command) => void;
  /** 여는 버튼 내용 */
  trigger: ReactNode;
  /** 패널·입력칸 이름 (스크린 리더) */
  label?: string;
  placeholder?: string;
  /**
   * ⌘K / Ctrl+K 로 열기.
   * "global": 페이지 어디서나, "focus": 포커스가 이 컴포넌트 안에 있을 때만
   * (한 페이지에 여러 개가 있을 때), false: 버튼으로만.
   */
  hotkey?: "global" | "focus" | false;
  className?: string;
  panelClassName?: string;
}

function matches(command: Command, query: string) {
  const haystack = [command.label, command.hint ?? "", ...(command.keywords ?? [])]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

const isHotkey = (e: KeyboardEvent | ReactKeyboardEvent) =>
  e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !e.altKey;

/**
 * ⌘K 로 여는 명령 목록. 입력하면 걸러지고 ↑/↓ 로 고르고 Enter 로 실행한다.
 * 고른 줄의 배경은 layoutId 로 줄 사이를 미끄러진다.
 * 패널은 가장 가까운 position 이 있는 조상 안에 뜬다.
 */
export function CommandPalette({
  commands,
  onRun,
  trigger,
  label = "Command palette",
  placeholder = "Type a command",
  hotkey = "global",
  className,
  panelClassName,
}: CommandPaletteProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => commands.filter((c) => matches(c, query)), [commands, query]);
  const current = results[Math.min(active, results.length - 1)];

  // setState 와 ref 만 쓰므로 렌더마다 새로 만들어도 동작이 같다 — effect 는 열고 닫을 때만 다시 건다
  function show() {
    setQuery("");
    setActive(0);
    setOpen(true);
  }
  function hide(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus({ preventScroll: true });
  }
  const actions = useRef({ show, hide });
  useEffect(() => {
    actions.current = { show, hide };
  });
  function run(command: Command) {
    hide(true);
    onRun(command);
  }

  // 페이지 어디서나 ⌘K
  useEffect(() => {
    if (hotkey !== "global") return;
    const onKey = (e: KeyboardEvent) => {
      if (!isHotkey(e) || e.defaultPrevented) return;
      e.preventDefault();
      actions.current.show();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);

  // Esc 는 캡처 단계에서 먼저 받아 멈춘다 — 바깥 모달이 같은 Esc 로 함께 닫히지 않도록.
  // 포커스가 패널 밖에 있으면 그쪽의 Esc 다
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !panelRef.current?.contains(document.activeElement)) return;
      e.stopImmediatePropagation();
      actions.current.hide(true);
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [open]);

  // 고른 줄이 목록 밖으로 나가면 보이게
  useEffect(() => {
    if (current)
      document.getElementById(`${id}-${current.id}`)?.scrollIntoView({ block: "nearest" });
  }, [current, id]);

  function onInputKey(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (Math.min(i, results.length - 1) + step + results.length) % results.length);
    } else if (e.key === "Enter" && current) {
      e.preventDefault();
      run(current);
    }
  }

  return (
    // oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- 포커스가 안에 있을 때의 ⌘K
    <div
      className={cx(css.root, className)}
      onKeyDown={(e) => {
        if (hotkey === "focus" && isHotkey(e)) {
          e.preventDefault();
          show();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={css.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={show}
      >
        {trigger}
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            className={css.layer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: reduce ? 0 : 0.15 }}
          >
            <div className={css.backdrop} aria-hidden onClick={() => hide(false)} />
            <m.div
              ref={panelRef}
              role="dialog"
              aria-label={label}
              className={cx(css.panel, panelClassName)}
              initial={reduce ? false : { scale: 0.96, y: -8 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduce ? undefined : { scale: 0.98, y: -4 }}
              transition={
                reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 }
              }
              onBlur={(e) => {
                // Tab 등으로 패널을 떠나면 닫는다 (포커스는 옮겨 간 곳에 둔다)
                if (!e.currentTarget.contains(e.relatedTarget)) hide(false);
              }}
            >
              <input
                // oxlint-disable-next-line jsx-a11y/no-autofocus -- 열자마자 입력하도록
                autoFocus
                className={css.input}
                role="combobox"
                aria-label={label}
                aria-expanded
                aria-controls={`${id}-list`}
                aria-autocomplete="list"
                aria-activedescendant={current ? `${id}-${current.id}` : undefined}
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
              />
              <div id={`${id}-list`} role="listbox" aria-label={label} className={css.list}>
                {results.map((command) => {
                  const selected = command === current;
                  return (
                    <div
                      key={command.id}
                      id={`${id}-${command.id}`}
                      role="option"
                      tabIndex={-1}
                      aria-selected={selected}
                      className={css.option}
                      onPointerMove={() => setActive(results.indexOf(command))}
                      // 입력칸의 포커스를 지키고 click 으로 실행한다
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => run(command)}
                    >
                      {selected && (
                        <m.span
                          layoutId={`${id}-active`}
                          className={css.highlight}
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 600, damping: 40 }
                          }
                        />
                      )}
                      <span className={css.label}>{command.label}</span>
                      {command.hint && <span className={css.hint}>{command.hint}</span>}
                    </div>
                  );
                })}
              </div>
              {results.length === 0 && <p className={css.empty}>No matching commands</p>}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
