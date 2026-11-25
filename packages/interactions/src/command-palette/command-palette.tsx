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
import { createPortal } from "react-dom";
import { cx } from "../lib/cx.ts";
import { isComposing } from "../lib/is-composing.ts";
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
  /** 같은 group 끼리 제목 아래 묶인다 (처음 나온 순서대로) */
  group?: string;
}

interface CommandPaletteProps {
  commands: Command[];
  onRun: (command: Command) => void;
  /** 여는 버튼 내용 */
  trigger: ReactNode;
  /** 패널·입력칸 이름 (스크린 리더) */
  label?: string;
  placeholder?: string;
  /** 걸러진 결과가 없을 때 */
  emptyLabel?: string;
  /** 검색 방식 — 기본은 대소문자 무시 부분 일치(defaultMatch). 한글 초성 검색 등은 여기서 바꾼다 */
  match?: CommandMatcher;
  /** label 에서 맞은 부분(<mark>)의 모양 */
  markClassName?: string;
  /**
   * ⌘K / Ctrl+K 로 열기.
   * "global": 페이지 어디서나, "focus": 포커스가 이 컴포넌트 안에 있을 때만
   * (한 페이지에 여러 개가 있을 때), false: 버튼으로만.
   */
  hotkey?: "global" | "focus" | false;
  /**
   * true: 가장 가까운 position 이 있는 조상 안에 뜬다 (카드·데모 안)
   * false: 화면 전체 위에 뜬다 (페이지 헤더의 검색 등)
   */
  contained?: boolean;
  className?: string;
  panelClassName?: string;
}

/** 검색어가 맞은 결과 — 없으면(null) 목록에서 빠진다 */
export interface CommandMatch {
  /** label 안에서 맞은 구간 [시작, 끝) — 하이라이트한다 */
  ranges?: readonly (readonly [number, number])[];
  /** 클수록 같은 묶음 안에서 위로 (기본 0) */
  score?: number;
}

export type CommandMatcher = (command: Command, query: string) => CommandMatch | null;

/** label 에서 word 가 나오는 모든 구간 (대소문자 무시) */
function occurrences(label: string, word: string) {
  const ranges: [number, number][] = [];
  const lower = label.toLowerCase();
  for (let at = lower.indexOf(word); at !== -1; at = lower.indexOf(word, at + word.length)) {
    ranges.push([at, at + word.length]);
  }
  return ranges;
}

/**
 * 기본 검색: 띄어 쓴 단어가 모두 label · hint · keywords 어딘가에 들어 있으면 맞다.
 * label 에서 맞은 곳을 하이라이트하고, label 이 검색어로 시작하면 > 단어 첫머리에서 맞으면 > 그 밖 순으로 위로 올린다.
 * 다른 언어(초성 검색 등)는 `match` prop 으로 바꾼다.
 */
export const defaultMatch: CommandMatcher = (command, query) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return {};
  const haystack = [command.label, command.hint ?? "", ...(command.keywords ?? [])]
    .join(" ")
    .toLowerCase();
  if (!words.every((word) => haystack.includes(word))) return null;
  const label = command.label.toLowerCase();
  const whole = query.trim().toLowerCase();
  const score = label.startsWith(whole)
    ? 3
    : new RegExp(`(^|\\s)${whole.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(label)
      ? 2
      : label.includes(whole)
        ? 1
        : 0;
  return { ranges: words.flatMap((word) => occurrences(command.label, word)), score };
};

/** 겹치거나 붙은 구간을 합친다 */
function merge(ranges: readonly (readonly [number, number])[]) {
  const sorted = [...ranges].filter(([a, b]) => b > a).toSorted((x, y) => x[0] - y[0]);
  const out: [number, number][] = [];
  for (const [a, b] of sorted) {
    const last = out.at(-1);
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else out.push([a, b]);
  }
  return out;
}

/** label 을 맞은 구간은 <mark> 로 감싸 나눈다 */
function highlight(label: string, ranges: CommandMatch["ranges"], markClassName?: string) {
  if (!ranges?.length) return label;
  const parts: ReactNode[] = [];
  let at = 0;
  for (const [a, b] of merge(ranges)) {
    if (a > at) parts.push(label.slice(at, a));
    parts.push(
      <mark key={a} className={cx(css.mark, markClassName)}>
        {label.slice(a, b)}
      </mark>,
    );
    at = b;
  }
  if (at < label.length) parts.push(label.slice(at));
  return parts;
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
  emptyLabel = "No matching commands",
  match = defaultMatch,
  markClassName,
  hotkey = "global",
  contained = true,
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
  // 걸러진 명령을 group 별로 묶는다 — ↑/↓ 순서도 화면에 보이는 순서(묶음 순서)를 따른다
  // 묶음 순서는 명령 순서 그대로, 묶음 안에서는 점수가 높은 것부터 (같으면 원래 순서)
  const { sections, hits } = useMemo(() => {
    const found = new Map<Command, CommandMatch>();
    const groups = new Map<string | undefined, Command[]>();
    for (const c of commands) {
      const hit = match(c, query);
      if (!hit) continue;
      found.set(c, hit);
      groups.set(c.group, [...(groups.get(c.group) ?? []), c]);
    }
    const ordered = [...groups].map(([group, items]) => ({
      group,
      items: items.toSorted((a, b) => (found.get(b)?.score ?? 0) - (found.get(a)?.score ?? 0)),
    }));
    return { sections: ordered, hits: found };
  }, [commands, query, match]);
  const results = useMemo(() => sections.flatMap((s) => s.items), [sections]);
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
  // 화면 전체를 덮을 때는 body 로 꺼낸다 — sticky·transform 조상이 만드는 쌓임 맥락에 갇히면
  // 뒤따르는 본문 아래에 깔린다. className 은 꺼낸 쪽에도 붙여 쓰는 쪽이 준 CSS 변수(--palette-*)가 그대로 닿게 한다.
  // (서버 렌더에는 document 가 없고 닫혀 있으므로 꺼낼 것도 없다)
  const portal = (node: ReactNode) =>
    contained || typeof document === "undefined"
      ? node
      : createPortal(<div className={cx(css.root, className)}>{node}</div>, document.body);

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
      // 조합을 취소하는 Esc 로는 닫지 않는다
      if (!isComposing(e)) actions.current.hide(true);
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [open]);

  // 고른 줄이 목록 밖으로 나가면 보이게
  useEffect(() => {
    if (current)
      document.getElementById(`${id}-${current.id}`)?.scrollIntoView({ block: "nearest" });
  }, [current, id]);

  function renderOption(command: Command) {
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
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 40 }}
          />
        )}
        <span className={css.label}>
          {highlight(command.label, hits.get(command)?.ranges, markClassName)}
        </span>
        {command.hint && <span className={css.hint}>{command.hint}</span>}
      </div>
    );
  }

  function onInputKey(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (isComposing(e.nativeEvent)) return;
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

      {portal(
        <AnimatePresence>
          {open && (
            <m.div
              className={contained ? css.layer : css.layerFixed}
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
                  {sections.map(({ group, items }, g) =>
                    group === undefined ? (
                      items.map(renderOption)
                    ) : (
                      <div key={group} role="group" aria-labelledby={`${id}-g${g}`}>
                        <div id={`${id}-g${g}`} role="presentation" className={css.groupLabel}>
                          {group}
                        </div>
                        {items.map(renderOption)}
                      </div>
                    ),
                  )}
                </div>
                {results.length === 0 && <p className={css.empty}>{emptyLabel}</p>}
              </m.div>
            </m.div>
          )}
        </AnimatePresence>,
      )}
    </div>
  );
}
