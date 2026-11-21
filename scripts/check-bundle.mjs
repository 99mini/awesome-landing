// 사용법: pnpm check:bundle  (먼저 갤러리를 빌드해야 한다 — CI 는 pnpm build 다음에 돌린다)
// 갤러리 빌드 결과의 JS 크기(gzip)가 예산을 넘으면 실패한다.
// 예산은 측정값의 약 1.1배 — 늘려야 한다면 이유를 PR 에 적고 여기 숫자를 고친다.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const dist = new URL("../apps/gallery/dist/", import.meta.url).pathname;
const KB = 1024;

/** [이름, 파일 고르기, gzip 예산(바이트), 측정값 메모] */
const BUDGETS = [
  // react-dom(43%) · motion(30%) · react-router(20%) 이 대부분 — 데모 코드는 들어가지 않는다
  ["entry", (f, entry) => f === entry, 170 * KB, "2026-11 측정 151KB"],
  // 인터랙션 하나의 데모 코드 — 화면에 처음 올 때 받는다
  ["each demo", (f) => /^demo-.*\.js$/.test(f), 12 * KB, "가장 큰 것 3.6KB"],
  // 소스 보기 + 하이라이터 — 모달을 열 때 받는다
  ["source viewer", (f) => /^source-viewer-.*\.js$/.test(f), 20 * KB, "13KB"],
];

if (!existsSync(join(dist, "index.html"))) {
  console.error("✖ apps/gallery/dist 가 없습니다. 먼저 `pnpm --filter @awesome/gallery build`.");
  process.exit(1);
}

const entry = readFileSync(join(dist, "index.html"), "utf8").match(
  /assets\/(index-[^"]+\.js)/,
)?.[1];
const files = readdirSync(join(dist, "assets")).filter((f) => f.endsWith(".js"));
const gz = (f) => gzipSync(readFileSync(join(dist, "assets", f))).length;
const fmt = (n) => `${(n / KB).toFixed(1)}KB`;

let failed = false;
for (const [name, pick, budget, note] of BUDGETS) {
  const matched = files.filter((f) => pick(f, entry));
  if (matched.length === 0) {
    console.error(
      `✖ ${name}: 해당하는 파일이 없습니다 (빌드 구조가 바뀌었다면 예산 정의를 고치세요)`,
    );
    failed = true;
    continue;
  }
  const largest = matched.map((f) => [f, gz(f)]).toSorted((a, b) => b[1] - a[1])[0];
  const ok = largest[1] <= budget;
  failed ||= !ok;
  console.log(
    `${ok ? "✔" : "✖"} ${name.padEnd(14)} ${fmt(largest[1]).padStart(8)} / ${fmt(budget)}  (${matched.length} file${matched.length > 1 ? "s" : ""}, ${note})`,
  );
}

process.exit(failed ? 1 : 0);
