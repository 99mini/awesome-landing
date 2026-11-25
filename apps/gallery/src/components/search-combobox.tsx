/*
 * 네이티브 <select>·<datalist> 는 모양을 바꿀 수도, 그룹·하이라이트를 넣을 수도 없어서
 * WAI-ARIA APG 의 combobox 패턴을 직접 구현한다. 그래서 역할 대신 태그를 권하는 규칙은 끈다.
 * 키보드 조작은 옵션이 아니라 combobox(버튼·입력칸)가 맡으므로, 옵션의 click 은 포인터 전용이다.
 */
/* oxlint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/click-events-have-key-events */
import { interactions } from "@awesome/interactions/registry";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CATEGORIES, TAGS, categoryCount, tagCount } from "../hooks/use-gallery-filters.ts";
import { Search } from "./icons.tsx";
import * as css from "./listbox.css.ts";

type Kind = "interaction" | "tag" | "category";

interface Suggestion {
  kind: Kind;
  value: string;
  label: string;
  meta: string;
}

const GROUP_LABEL: Record<Kind, string> = {
  interaction: "Interactions",
  tag: "Tags",
  category: "Categories",
};

const LIMIT: Record<Kind, number> = { interaction: 6, tag: 5, category: 5 };

/** 앞에서 일치하는 것을 먼저, 그다음 중간에 포함된 것 */
function rank<T>(items: T[], text: (item: T) => string, q: string) {
  const hits = items.filter((item) => text(item).toLowerCase().includes(q));
  return hits.toSorted(
    (a, b) =>
      Number(!text(a).toLowerCase().startsWith(q)) - Number(!text(b).toLowerCase().startsWith(q)),
  );
}

function suggest(query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  const found: Suggestion[] = rank(interactions, (it) => it.meta.title, q)
    .slice(0, LIMIT.interaction)
    .map((it) => ({
      kind: "interaction" as const,
      value: it.meta.slug,
      label: it.meta.title,
      meta: it.meta.category,
    }));
  // 빈 검색어에서는 인터랙션만 보여준다 (태그·카테고리는 옆 컨트롤에 이미 있다)
  if (!q) return found;
  found.push(
    ...rank(TAGS, (t) => t, q)
      .slice(0, LIMIT.tag)
      .map((t) => ({ kind: "tag" as const, value: t, label: t, meta: String(tagCount(t)) })),
    ...rank(CATEGORIES, (c) => c, q)
      .slice(0, LIMIT.category)
      .map((c) => ({
        kind: "category" as const,
        value: c,
        label: c,
        meta: String(categoryCount(c)),
      })),
  );
  return found;
}

/** 검색어와 일치한 첫 부분을 굵게 */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const at = q ? text.toLowerCase().indexOf(q) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className={css.match}>{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  );
}

interface SearchComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onPick: (kind: Kind, value: string) => void;
}

/**
 * 자동완성 검색창 (WAI-ARIA editable combobox, list autocomplete).
 * 입력하는 동안 아무것도 자동 선택하지 않는다 — 타이핑은 그대로 목록을 거르고,
 * ↑↓ 로 제안을 가리킨 뒤 Enter 로 고른다. Esc 는 열린 목록을 닫고, 닫혀 있으면 검색어를 지운다.
 */
export function SearchCombobox({ value, onChange, onPick }: SearchComboboxProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // 입력값은 직접 들고 있는다 — URL 을 거쳐 돌아오는 값으로만 그리면, 빠르게 칠 때
  // 라우터가 따라오기 전에 다음 글자가 옛 값 위에 쓰여 글자가 빠진다.
  const [text, setText] = useState(value);
  // 보냈지만 아직 URL 로 돌아오지 않은 값들 — 늦게 도착한 옛 값을 외부 변경으로 오해하지 않도록
  const pending = useRef<string[]>([]);
  // 우리가 보낸 값이 아닌 URL 변화(뒤로가기, 필터 지우기, 태그 선택)만 입력칸에 반영
  useEffect(() => {
    const at = pending.current.indexOf(value);
    if (at >= 0) {
      pending.current.splice(0, at + 1);
      return;
    }
    pending.current = [];
    setText(value);
  }, [value]);
  const suggestions = useMemo(() => suggest(text), [text]);
  const visible = open && suggestions.length > 0;

  useEffect(() => {
    if (!visible || active < 0) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [visible, active]);

  function change(next: string) {
    pending.current.push(next);
    setText(next);
    onChange(next);
  }

  function pick(index: number) {
    const s = suggestions[index];
    if (!s) return;
    setOpen(false);
    setActive(-1);
    onPick(s.kind, s.value);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // 한글 조합 중의 Enter·Esc·방향키는 입력기의 것 (229 는 Safari 의 확정 Enter)
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const last = suggestions.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!visible) {
          setOpen(true);
          setActive(0);
        } else setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        if (!visible) return;
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Enter":
        if (visible && active >= 0) {
          e.preventDefault();
          pick(active);
        } else setOpen(false);
        break;
      case "Escape":
        // 바깥(갤러리 모달 등)으로 Esc 가 번지지 않게
        e.stopPropagation();
        if (visible) {
          e.preventDefault();
          setOpen(false);
          setActive(-1);
        } else if (text) {
          e.preventDefault();
          change("");
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  // 그룹별로 나누되, 키보드 이동은 전체를 한 줄로 센다
  let index = 0;
  const groups = (["interaction", "tag", "category"] as const)
    .map((kind) => ({ kind, items: suggestions.filter((s) => s.kind === kind) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className={css.searchAnchor}>
      <Search className={css.searchIcon} />
      <input
        type="search"
        role="combobox"
        aria-label="Search interactions"
        aria-autocomplete="list"
        aria-expanded={visible}
        aria-controls={`${id}-list`}
        aria-activedescendant={visible && active >= 0 ? `${id}-opt-${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        className={css.searchField}
        placeholder="Search interactions, tags"
        value={text}
        onChange={(e) => {
          change(e.currentTarget.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => text && setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />

      <AnimatePresence>
        {visible && (
          <m.div
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label="Suggestions"
            className={css.panel}
            initial={{ opacity: 0, y: reduce ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4 }}
            transition={{ duration: reduce ? 0 : 0.14 }}
          >
            {groups.map((group) => (
              <div
                key={group.kind}
                role="group"
                aria-labelledby={`${id}-${group.kind}`}
                className={css.group}
              >
                <div id={`${id}-${group.kind}`} role="presentation" className={css.groupLabel}>
                  {GROUP_LABEL[group.kind]}
                </div>
                {group.items.map((s) => {
                  const i = index++;
                  return (
                    <div
                      key={`${s.kind}:${s.value}`}
                      id={`${id}-opt-${i}`}
                      role="option"
                      tabIndex={-1}
                      aria-selected={i === active}
                      data-index={i}
                      data-active={i === active}
                      className={css.option}
                      onPointerMove={() => setActive(i)}
                      // 입력칸의 포커스를 지키고(blur 로 닫히지 않게) click 으로 고른다
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(i)}
                    >
                      <span className={css.optionLabel}>
                        <Highlight text={s.label} query={text} />
                      </span>
                      <span className={css.optionMeta}>{s.meta}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
