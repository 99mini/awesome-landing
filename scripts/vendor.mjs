// 사용법: pnpm vendor:interactions <대상 폴더>
// @awesome/interactions 를 빌드해서 다른 저장소에 복사해 넣는다 (npm 배포 전까지의 방식).
// 빌드 결과(JS·CSS·타입)만 옮기고 소스맵은 뺀다 — 소스가 없는 곳에서는 가리킬 데가 없다.
// 어느 커밋에서 만들었는지 VENDOR.json 에 남긴다.
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const target = process.argv[2] && resolve(process.argv[2]);
if (!target) {
  console.error("usage: pnpm vendor:interactions <target-dir>");
  process.exit(2);
}

const build = spawnSync("pnpm", ["--filter", "@awesome/interactions", "build"], {
  cwd: root,
  stdio: "inherit",
});
if (build.status !== 0) process.exit(build.status ?? 1);

const dist = join(root, "packages/interactions/dist");
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(dist, target, { recursive: true, filter: (src) => !src.endsWith(".map") });

// 진입점 옆에 타입을 둔다 — `./index.js` 를 가져오면 같은 자리의 `index.d.ts` 를 읽는다
writeFileSync(join(target, "index.d.ts"), 'export * from "./types/index.d.ts";\n');
writeFileSync(
  join(target, "motion.d.ts"),
  'export * from "./types/motion/motion-provider.d.ts";\n',
);

const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const dirty = git("status", "--porcelain", "--", "packages/interactions") !== "";
writeFileSync(
  join(target, "VENDOR.json"),
  `${JSON.stringify(
    {
      package: "@awesome/interactions",
      source: "awesome-landing",
      commit: git("rev-parse", "HEAD"),
      dirty,
      builtAt: new Date().toISOString(),
      refresh: "in awesome-landing: pnpm vendor:interactions <this folder>",
    },
    null,
    2,
  )}\n`,
);

const files = readdirSync(target, { recursive: true }).filter((f) => !String(f).includes("/"));
console.log(`✔ vendored into ${relative(process.cwd(), target) || target}: ${files.join(", ")}`);
if (dirty)
  console.warn(
    "⚠ packages/interactions 에 커밋하지 않은 변경이 있습니다 — VENDOR.json 의 commit 과 내용이 다를 수 있습니다.",
  );
if (!existsSync(join(target, "style.css"))) process.exit(1);
