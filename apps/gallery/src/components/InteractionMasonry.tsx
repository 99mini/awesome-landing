import type { InteractionDemoModule } from "@awesome/interactions/registry";
import { motion } from "motion/react";
import { Tags } from "./Tags.tsx";

interface InteractionMasonryProps {
  items: InteractionDemoModule[];
  onOpen: (slug: string) => void;
}

export function InteractionMasonry({ items, onOpen }: InteractionMasonryProps) {
  return (
    <div className="masonry">
      {items.map(({ meta, default: Demo }, i) => (
        <motion.div
          key={meta.slug}
          className="masonry-item"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 카드 어디를 눌러도 열린다. 키보드는 제목 버튼(Enter/Space)의 click 이 카드로 버블링된다 */}
          {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <motion.article
            layoutId={`shell-${meta.slug}`}
            layoutCrossfade={false}
            className="preview-card"
            style={{ borderRadius: 20 }}
            onClick={() => onOpen(meta.slug)}
          >
            <motion.div
              layoutId={`stage-${meta.slug}`}
              layoutCrossfade={false}
              className="preview-stage"
              style={{ borderRadius: 14 }}
            >
              <motion.div layout="position" className="demo-fit">
                <Demo />
              </motion.div>
            </motion.div>
            <motion.footer layout="position" className="preview-footer">
              <span className="badge">{meta.category}</span>
              <button type="button" className="preview-open">
                <motion.span
                  layoutId={`title-${meta.slug}`}
                  layoutCrossfade={false}
                  className="preview-title"
                >
                  {meta.title}
                </motion.span>
              </button>
              <Tags tags={meta.tags} />
            </motion.footer>
          </motion.article>
        </motion.div>
      ))}
    </div>
  );
}
