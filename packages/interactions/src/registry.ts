import type { InteractionDemoModule } from "./types.ts";

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

export type { InteractionDemoModule, InteractionMeta, InteractionCategory } from "./types.ts";
