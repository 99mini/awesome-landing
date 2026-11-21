export interface LandingMeta {
  name: string;
  title: string;
  description: string;
  /** dev 서버 포트 — `pnpm dev:all` 로 함께 띄웠을 때 링크 대상 */
  port: number;
  tags?: string[];
}

/** `landings/<name>/landing.json` 을 자동 수집 */
const modules = import.meta.glob<LandingMeta>("../../../landings/*/landing.json", {
  eager: true,
  import: "default",
});

export const landings = Object.values(modules).toSorted((a, b) => a.title.localeCompare(b.title));
