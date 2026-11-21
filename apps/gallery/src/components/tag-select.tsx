/*
 * 네이티브 <select>·<datalist> 는 모양을 바꿀 수도, 그룹·하이라이트를 넣을 수도 없어서
 * WAI-ARIA APG 의 combobox 패턴을 직접 구현한다. 그래서 역할 대신 태그를 권하는 규칙은 끈다.
 * 키보드 조작은 옵션이 아니라 combobox(버튼·입력칸)가 맡으므로, 옵션의 click 은 포인터 전용이다.
 */
/* oxlint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/click-events-have-key-events */
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, Chevron } from "./icons.tsx";
import * as css from "./listbox.css.ts";

export interface SelectOption {
  value: string | null;
  label: string;
  /** 오른쪽에 붙는 보조 정보 (개수 등) */
  meta?: string;
}

interface TagSelectProps {
  /** 버튼 앞에 붙는 이름 (스크린 리더에도 쓰인다) */
  label: string;
  value: string | null;
  options: SelectOption[];
  onChange: (value: string | null) => void;
}

/**
 * 네이티브 <select> 대신 쓰는 드롭다운 (WAI-ARIA select-only combobox).
 * 포커스는 버튼에 머물고, 가리키는 항목은 aria-activedescendant 로 알린다.
 * ↑↓ Home End 로 이동, Enter·Space 로 선택, Esc 로 닫기, 글자를 치면 그 글자로 시작하는 항목으로.
 */
export function TagSelect({ label, value, options, onChange }: TagSelectProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: "", timer: 0 });
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const [active, setActive] = useState(selectedIndex);
  const current = options[selectedIndex];

  // 바깥을 누르면 닫는다
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // 가리키는 항목이 목록 밖이면 보이도록 스크롤
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function show(index = selectedIndex) {
    setActive(index);
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  }

  function jumpTo(char: string) {
    const t = typeahead.current;
    window.clearTimeout(t.timer);
    t.text += char.toLowerCase();
    t.timer = window.setTimeout(() => (t.text = ""), 500);
    const start = open ? active + 1 : selectedIndex + 1;
    const order = [...options.slice(start), ...options.slice(0, start)];
    const hit = order.find((o) => o.label.toLowerCase().startsWith(t.text));
    if (hit) {
      const index = options.indexOf(hit);
      if (open) setActive(index);
      else onChange(hit.value);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show(e.key === "ArrowUp" ? Math.max(0, selectedIndex - 1) : selectedIndex);
      } else if (e.key.length === 1 && /\S/.test(e.key)) {
        jumpTo(e.key);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        // 바깥(갤러리 모달 등)으로 Esc 가 번지지 않게
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) jumpTo(e.key);
    }
  }

  return (
    <div ref={rootRef} className={css.anchor}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        aria-label={`${label}: ${current?.label ?? ""}`}
        className={css.trigger}
        data-value={value !== null}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
      >
        <span className={css.triggerLabel}>{label}</span>
        <span>{current?.label}</span>
        <Chevron className={css.chevron} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            className={css.panel}
            initial={{ opacity: 0, y: reduce ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4 }}
            transition={{ duration: reduce ? 0 : 0.14 }}
          >
            {options.map((option, i) => {
              const selected = i === selectedIndex;
              return (
                <div
                  key={option.value ?? "__any"}
                  id={`${id}-opt-${i}`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={selected}
                  data-index={i}
                  data-active={i === active}
                  className={css.option}
                  onPointerMove={() => setActive(i)}
                  // 버튼의 포커스를 빼앗지 않도록 mousedown 기본 동작을 막고 click 으로 고른다
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(i)}
                >
                  {selected ? (
                    <Check className={css.check} />
                  ) : (
                    <span className={css.checkSpacer} />
                  )}
                  <span className={css.optionLabel}>{option.label}</span>
                  {option.meta && <span className={css.optionMeta}>{option.meta}</span>}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
