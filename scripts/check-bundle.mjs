// 사용법: pnpm check:bundle  (먼저 빌드해야 한다 — CI 는 pnpm build 다음에 돌린다)
// 빌드 결과의 JS 크기(gzip)가 예산을 넘으면 실패한다.
// 예산은 측정값의 약 1.1배 — 늘려야 한다면 이유를 PR 에 적고 여기 숫자를 고친다.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { gzipSync } from "node:zlib";

const root = new URL("../", import.meta.url).pathname;
const KB = 1024;
const fmt = (n) => `${(n / KB).toFixed(1)}KB`;
const gz = (file) => gzipSync(readFileSync(file)).length;

/**
 * 첫 로드 JS — index.html 의 entry 와, 그것이 정적으로 import 하는 조각 전부.
 * (entry 파일 하나만 재면 bundler 가 떼어 낸 공유 조각이 빠진다)
 */
function firstLoad(dist) {
  const html = readFileSync(join(dist, "index.html"), "utf8");
  const entry = html.match(/<script type="module"[^>]*src="\.?\/?([^"]+\.js)"/)?.[1];
  if (!entry) throw new Error(`${dist}/index.html 에서 entry 를 못 찾았습니다`);
  return staticClosure(dist, entry);
}

/** 파일 하나와 그것이 정적으로 import 하는 조각 전부 (dist 기준 경로) */
function staticClosure(dist, start) {
  const seen = new Set();
  const stack = [start];
  while (stack.length > 0) {
    const file = stack.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const src = readFileSync(join(dist, file), "utf8");
    // `import … from "./x.js"` · `import "./x.js"` 만 — `import("./x.js")` 는 나중에 받는 것
    for (const m of src.matchAll(/(?:\bfrom\s*|\bimport\s*)["'](\.\/[^"']+\.js)["']/g)) {
      stack.push(join(dirname(file), m[1]));
    }
  }
  return [...seen];
}

/** [이름, 앱 폴더, 첫 로드 예산, 측정값 메모] */
const APPS = [
  // react-dom · react-router 가 대부분. Motion 은 m + LazyMotion 이라 기능 묶음은 나중에 받는다
  ["gallery", "apps/gallery", 140 * KB, "2026-11 측정 126KB"],
  ["aurora", "landings/aurora", 95 * KB, "85KB"],
  ["editorial", "landings/editorial", 115 * KB, "104KB"],
  ["index", "landings/index", 100 * KB, "88KB"],
  ["ochre", "landings/ochre", 100 * KB, "91KB"],
];

/** 갤러리에서 나중에 받는 것들 — 가장 큰 파일 기준 */
const LAZY = [
  // 인터랙션 하나의 데모 코드 — 화면에 처음 올 때 받는다
  ["each demo", /^demo-.*\.js$/, 12 * KB, "가장 큰 것 3.6KB"],
  // 소스 보기 + 하이라이터 — 모달을 열 때 받는다
  ["source viewer", /^source-viewer-.*\.js$/, 20 * KB, "13KB"],
];

let failed = false;
const report = (ok, name, size, budget, note) => {
  // budget 은 상한, motion later 는 하한
  failed ||= !ok;
  console.log(
    `${ok ? "✔" : "✖"} ${name.padEnd(16)} ${fmt(size).padStart(8)} / ${fmt(budget)}  (${note})`,
  );
};

for (const [name, dir, budget, note] of APPS) {
  const dist = join(root, dir, "dist");
  if (!existsSync(join(dist, "index.html"))) {
    console.error(`✖ ${dir}/dist 가 없습니다. 먼저 \`pnpm build\`.`);
    failed = true;
    continue;
  }
  const files = firstLoad(dist);
  const size = files.reduce((sum, f) => sum + gz(join(dist, f)), 0);
  report(size <= budget, `${name} first load`, size, budget, `${files.length} files, ${note}`);

  // Motion 기능 묶음(LazyMotion 이 나중에 받는 것) 중 첫 로드에 없는 부분.
  // `motion` 을 직접 import 하거나 barrel 이 Reorder 를 끌어오면 기능 코드가 첫 로드로 옮겨가 이 값이 작아진다
  const features = readdirSync(join(dist, "assets")).find((f) =>
    /^motion-features-.*\.js$/.test(f),
  );
  if (!features) {
    console.error(`✖ ${name}: motion-features 조각이 없습니다 (MotionProvider 를 쓰는지 확인)`);
    failed = true;
    continue;
  }
  const first = new Set(files);
  const deferred = staticClosure(dist, join("assets", features))
    .filter((f) => !first.has(f))
    .reduce((sum, f) => sum + gz(join(dist, f)), 0);
  const min = 10 * KB;
  report(
    deferred >= min,
    `${name} motion later`,
    deferred,
    min,
    "이보다 작으면 기능 묶음이 첫 로드로 새었다",
  );
}

const galleryAssets = join(root, "apps/gallery/dist/assets");
const assets = existsSync(galleryAssets) ? readdirSync(galleryAssets) : [];
for (const [name, pattern, budget, note] of LAZY) {
  const matched = assets.filter((f) => pattern.test(f));
  if (matched.length === 0) {
    console.error(
      `✖ ${name}: 해당하는 파일이 없습니다 (빌드 구조가 바뀌었다면 예산 정의를 고치세요)`,
    );
    failed = true;
    continue;
  }
  const largest = Math.max(...matched.map((f) => gz(join(galleryAssets, f))));
  report(largest <= budget, name, largest, budget, `${matched.length} files, ${note}`);
}

process.exit(failed ? 1 : 0);
