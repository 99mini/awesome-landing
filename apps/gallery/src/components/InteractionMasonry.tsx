import { controlDefaults, type InteractionDemoModule } from "@awesome/interactions/registry";
import { motion } from "motion/react";
import { ReplayButton, useReplay } from "./ReplayButton.tsx";
import { Tags } from "./Tags.tsx";
import * as ui from "../styles/ui.css.ts";
import * as css from "./InteractionMasonry.css.ts";

interface InteractionMasonryProps {
  items: InteractionDemoModule[];
  onOpen: (slug: string) => void;
}

export function InteractionMasonry({ items, onOpen }: InteractionMasonryProps) {
  return (
    <div className={css.masonry}>
      {items.map((mod, i) => (
        <motion.div
          key={mod.meta.slug}
          className={css.item}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <PreviewCard mod={mod} onOpen={onOpen} />
        </motion.div>
      ))}
    </div>
  );
}

function PreviewCard({
  mod,
  onOpen,
}: {
  mod: InteractionDemoModule;
  onOpen: (slug: string) => void;
}) {
  const { meta, default: Demo } = mod;
  const { replayKey, replay } = useReplay();

  return (
    // 카드 어디를 눌러도 열린다. 키보드는 제목 버튼(Enter/Space)의 click 이 카드로 버블링된다
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <motion.article
      layoutId={`shell-${meta.slug}`}
      layoutCrossfade={false}
      className={css.card}
      style={{ borderRadius: 20 }}
      onClick={(e) => {
        // 데모 안의 버튼·링크·입력·다이얼로그를 조작한 클릭은 모달을 열지 않는다 (제목 버튼은 예외)
        const target = e.target as Element;
        const control = target.closest("button, a, input, select, textarea, dialog");
        if (control && !control.hasAttribute("data-open-interaction")) return;
        onOpen(meta.slug);
      }}
    >
      <motion.div
        layoutId={`stage-${meta.slug}`}
        layoutCrossfade={false}
        className={css.cardStage}
        style={{ borderRadius: 14 }}
      >
        <motion.div layout="position" className={ui.demoFit}>
          <Demo key={replayKey} {...controlDefaults(meta.controls)} />
        </motion.div>
        {meta.replayable !== false && (
          <div className={css.replaySlot}>
            <ReplayButton replayKey={replayKey} onReplay={replay} size="sm" />
          </div>
        )}
      </motion.div>
      <motion.footer layout="position" className={css.footer}>
        <span className={ui.badge}>{meta.category}</span>
        <button type="button" className={css.openButton} data-open-interaction>
          <motion.span
            layoutId={`title-${meta.slug}`}
            layoutCrossfade={false}
            className={css.title}
          >
            {meta.title}
          </motion.span>
        </button>
        <Tags tags={meta.tags} />
      </motion.footer>
    </motion.article>
  );
}
