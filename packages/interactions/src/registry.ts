import type {
  ControlValues,
  InteractionControls,
  InteractionDemoModule,
  SourceFile,
} from "./types.ts";

/**
 * `src/<slug>/demo.tsx` 를 자동 수집한다.
 * 새 인터랙션은 폴더만 추가하면 갤러리에 노출된다.
 */
const modules = import.meta.glob<InteractionDemoModule>("./*/demo.tsx", { eager: true });

/** 소스 보기용 원문 — 모달을 열 때만 불러온다 */
// `?source` 는 갤러리 vite 플러그인(apps/gallery/vite/source-plugin.ts)이 원문 문자열로 바꿔 준다
const sources = import.meta.glob<string>("./*/*.{ts,tsx}", { query: "?source", import: "default" });

export const interactions = Object.values(modules).toSorted((a, b) =>
  a.meta.title.localeCompare(b.meta.title),
);

export function findInteraction(slug: string) {
  return interactions.find((m) => m.meta.slug === slug);
}

/** 컴포넌트 → 스타일 → 데모 순으로 정렬한 인터랙션 폴더의 소스 */
export async function loadSources(slug: string): Promise<SourceFile[]> {
  const prefix = `./${slug}/`;
  const entries = Object.entries(sources).filter(([path]) => path.startsWith(prefix));
  const files = await Promise.all(
    entries.map(async ([path, load]) => ({ name: path.slice(prefix.length), code: await load() })),
  );
  return files.toSorted(
    (a, b) => sourceRank(a.name) - sourceRank(b.name) || a.name.localeCompare(b.name),
  );
}

function sourceRank(name: string) {
  if (name.startsWith("demo")) return name.endsWith(".css.ts") ? 3 : 2;
  return name.endsWith(".css.ts") ? 1 : 0;
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
