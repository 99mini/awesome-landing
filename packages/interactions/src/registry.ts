import { lazy, type ComponentType } from "react";
import type {
  ControlValues,
  InteractionControls,
  InteractionDemoModule,
  InteractionMeta,
} from "./types.ts";

/**
 * `src/<slug>/meta.ts` 를 자동 수집한다 — 새 인터랙션은 폴더만 추가하면 갤러리에 노출된다.
 * 목록·필터에 필요한 meta 는 첫 로드에 들어가고, 데모 코드는 화면에 처음 그려질 때 따로 받는다.
 */
const metas = import.meta.glob<InteractionMeta>("./*/meta.ts", { eager: true, import: "meta" });
const demos = import.meta.glob<{ default: ComponentType<ControlValues> }>("./*/demo.tsx");

export const interactions: InteractionDemoModule[] = Object.entries(metas)
  .map(([path, meta]) => {
    const load = demos[path.replace(/meta\.ts$/, "demo.tsx")];
    if (!load) throw new Error(`${path}: demo.tsx 가 없습니다`);
    // lazy 는 모듈이 처음 평가될 때 한 번만 만든다 — 렌더마다 만들면 매번 다시 마운트된다
    return { meta, default: lazy(load) };
  })
  .toSorted((a, b) => a.meta.title.localeCompare(b.meta.title));

export function findInteraction(slug: string) {
  return interactions.find((m) => m.meta.slug === slug);
}

/** controls 정의에서 기본값만 뽑는다 */
export function controlDefaults(controls: InteractionControls = {}): ControlValues {
  return Object.fromEntries(Object.entries(controls).map(([key, c]) => [key, c.default]));
}

export type {
  ControlValues,
  InteractionCategory,
  InteractionControls,
  InteractionDemoModule,
  InteractionMeta,
  NumberControl,
  SourceFile,
} from "./types.ts";
