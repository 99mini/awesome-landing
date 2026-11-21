import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { cx } from "../lib/cx.ts";
import * as css from "./accordion.css.ts";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: readonly AccordionItem[];
  /** 여러 개를 동시에 열 수 있는지 */
  multiple?: boolean;
  /** 열고 닫는 시간(s) */
  duration?: number;
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  panelClassName?: string;
}

/**
 * 레이아웃 애니메이션으로 열고 닫는 아코디언. height 를 직접 애니메이션하지 않는다 —
 * 상자 크기는 바로 바뀌고, 아래 항목들은 layout(transform)으로 미끄러지며, 내용은 페이드한다.
 */
export function Accordion({
  items,
  multiple = false,
  duration = 0.3,
  className,
  itemClassName,
  triggerClassName,
  panelClassName,
}: AccordionProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string[]>([]);
  const transition = { duration: reduce ? 0 : duration, ease: [0.22, 1, 0.36, 1] as const };

  function toggle(itemId: string) {
    setOpen((current) =>
      current.includes(itemId)
        ? current.filter((x) => x !== itemId)
        : multiple
          ? [...current, itemId]
          : [itemId],
    );
  }

  return (
    <LayoutGroup id={id}>
      <div className={cx(css.root, className)}>
        {items.map((item) => {
          const expanded = open.includes(item.id);
          const panelId = `${id}-${item.id}-panel`;
          const triggerId = `${id}-${item.id}-trigger`;
          return (
            <m.div
              key={item.id}
              layout={reduce ? false : "position"}
              transition={transition}
              className={cx(css.item, itemClassName)}
            >
              <h3 className={css.heading}>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  className={cx(css.trigger, triggerClassName)}
                  onClick={() => toggle(item.id)}
                >
                  <span>{item.title}</span>
                  <m.svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    aria-hidden
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={transition}
                  >
                    <path d="M8 3v10M3 8h10" />
                  </m.svg>
                </button>
              </h3>
              {/* popLayout: 닫히는 패널이 페이드하는 동안 자리를 차지하지 않는다 — 열리는 패널과
                  잠깐 둘 다 자리를 잡아 아래 항목이 밀렸다가 튀어 오르던 문제 */}
              <AnimatePresence initial={false} mode="popLayout">
                {expanded && (
                  <m.section
                    id={panelId}
                    aria-labelledby={triggerId}
                    className={cx(css.panel, panelClassName)}
                    initial={{ opacity: 0, y: reduce ? 0 : -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    // 닫힘은 아래 항목이 미끄러져 올라오는 것으로 보여준다 — 내용이 남아 페이드하면 올라오는 제목과 겹친다
                    exit={{ opacity: 0, transition: { duration: 0 } }}
                    transition={transition}
                  >
                    {item.content}
                  </m.section>
                )}
              </AnimatePresence>
            </m.div>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
