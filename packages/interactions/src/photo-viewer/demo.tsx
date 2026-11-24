import type { ControlValues } from "../types.ts";
import { visuallyHidden } from "../lib/visually-hidden.css.ts";
import * as css from "./demo.css.ts";
import { PhotoViewer, type PhotoViewerItem } from "./photo-viewer.tsx";

/** 사진 대신 CSS 로 그린 풍경 — 비율이 서로 달라 펼쳐지는 모양을 볼 수 있다 */
const SCENES = [
  { id: "dusk", label: "Dusk", aspect: 16 / 9 },
  { id: "forest", label: "Forest", aspect: 3 / 4 },
  { id: "sea", label: "Sea", aspect: 4 / 3 },
  { id: "field", label: "Field", aspect: 1 },
  { id: "ridge", label: "Ridge", aspect: 2 },
  { id: "cliff", label: "Cliff", aspect: 4 / 5 },
] as const;

const items: PhotoViewerItem[] = SCENES.map(({ id, label, aspect }) => ({
  id,
  label,
  aspect,
  thumbnail: (
    <span className={css.thumb}>
      <span className={css.scene[id]} />
      <span className={visuallyHidden}>{label}</span>
    </span>
  ),
  content: (
    <div className={css.scene[id]}>
      <span className={css.caption}>{label}</span>
    </div>
  ),
}));

export default function Demo({ duration, threshold }: ControlValues) {
  return (
    <div className={css.area}>
      <PhotoViewer
        contained
        items={items}
        duration={duration}
        threshold={threshold}
        radius={12}
        className={css.grid}
        triggerClassName={css.trigger}
        backdropClassName={css.backdrop}
        controlClassName={css.control}
        counterClassName={css.counter}
      />
    </div>
  );
}
