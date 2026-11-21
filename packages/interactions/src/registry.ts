import type { ControlValues, InteractionControls, InteractionDemoModule } from "./types.ts";

/**
 * `src/<slug>/demo.tsx` 를 자동 수집한다.
 * 새 인터랙션은 폴더만 추가하면 갤러리에 노출된다.
 */
const modules = import.meta.glob<InteractionDemoModule>("./*/demo.tsx", { eager: true });

export const interactions = Object.values(modules).toSorted((a, b) =>
  a.meta.title.localeCompare(b.meta.title),
);

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
