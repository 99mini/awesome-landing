import type { SourceFile } from "./types.ts";

/**
 * 소스 보기용 원문 — 모달을 열 때만 불러온다.
 * `?source` 는 갤러리 vite 플러그인(apps/gallery/vite/source-plugin.ts)이 원문 문자열로 바꿔 준다.
 * 그래서 이 모듈은 그 플러그인이 있는 앱(갤러리)에서만 import 한다 — 랜딩은 `./registry` 만 쓴다.
 */
const sources = import.meta.glob<string>("./*/*.{ts,tsx}", { query: "?source", import: "default" });

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

export type { SourceFile } from "./types.ts";
