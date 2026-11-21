// 사용법: pnpm new:landing <name> ["Title"]
import { cp, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const [name, title = name] = process.argv.slice(2);

if (!name || !/^[a-z0-9-]+$/.test(name)) {
  console.error('usage: pnpm new:landing <kebab-name> ["Title"]');
  process.exit(1);
}

const landingsDir = join(root, "landings");
const target = join(landingsDir, name);
if (existsSync(target)) {
  console.error(`landings/${name} already exists`);
  process.exit(1);
}

// 기존 랜딩의 포트 중 최댓값 + 1 (5200 부터)
const ports = await Promise.all(
  (await readdir(landingsDir)).map(async (dir) => {
    try {
      return JSON.parse(await readFile(join(landingsDir, dir, "landing.json"), "utf8")).port;
    } catch {
      return 0;
    }
  }),
);
const port = Math.max(5199, ...ports) + 1;

await cp(join(root, "templates/landing"), target, { recursive: true });

const files = ["package.json", "landing.json", "index.html", "src/app.tsx"];
await Promise.all(
  files.map(async (file) => {
    const path = join(target, file);
    const content = (await readFile(path, "utf8"))
      .replaceAll("__NAME__", name)
      .replaceAll("__TITLE__", title)
      .replaceAll('"__PORT__"', String(port));
    await writeFile(path, content);
  }),
);

console.log(`✔ landings/${name} created (port ${port})`);
console.log("  next: pnpm install && pnpm --filter @landing/" + name + " dev");
// 갤러리는 import.meta.glob 으로 landing.json 을 모으는데, 앱 루트 밖의 새 파일은 dev 서버가 감지하지 못한다
console.log("  갤러리 dev 서버가 켜져 있다면 재시작해야 목록에 나타납니다.");
