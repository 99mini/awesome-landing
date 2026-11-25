// 사용법: pnpm check:package
// npm 에 올라갈 tarball 을 실제로 만들어, 공개돼도 되는 것만 들어 있는지 확인한다.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const dir = mkdtempSync(join(tmpdir(), "interactions-pack-"));
const problems = [];
const expect = (ok, message) => ok || problems.push(message);

try {
  const run = (cmd, args, options) =>
    execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: "pipe", ...options });
  run("pnpm", ["--filter", "@99mini/interactions", "pack", "--pack-destination", dir]);
  const tarball = join(
    dir,
    readdirSync(dir).find((f) => f.endsWith(".tgz")),
  );
  run("tar", ["-xzf", tarball, "-C", dir]);

  const pkg = join(dir, "package");
  const files = readdirSync(pkg, { recursive: true, withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => join(f.parentPath, f.name).slice(pkg.length + 1));
  const manifest = JSON.parse(readFileSync(join(pkg, "package.json"), "utf8"));

  for (const name of ["README.md", "LICENSE", "CHANGELOG.md", "dist/style.css"])
    expect(files.includes(name), `없음: ${name}`);

  const allowed = /^(package\.json|README\.md|LICENSE|CHANGELOG\.md|dist\/.+\.(js|css|d\.ts))$/;
  for (const file of files) expect(allowed.test(file), `올리면 안 되는 파일: ${file}`);

  const text = JSON.stringify(manifest);
  for (const leak of ["workspace:", "catalog:", "@awesome/"])
    expect(!text.includes(leak), `package.json 에 ${leak} 가 남아 있다`);
  expect(!manifest.private, "private 이라 배포되지 않는다");
  expect(!manifest.devDependencies && !manifest.scripts, "개발용 항목이 남아 있다");

  // exports 가 가리키는 파일이 모두 있고, 저장소 안에서만 쓰는 조건·경로는 없다
  for (const [entry, target] of Object.entries(manifest.exports)) {
    const paths = typeof target === "string" ? { default: target } : target;
    expect(!paths.source, `${entry}: source 조건이 남아 있다`);
    for (const path of Object.values(paths))
      expect(existsSync(join(pkg, path)), `${entry}: ${path} 가 없다`);
  }

  // JS 가 가져오는 패키지는 모두 선언돼 있다
  const declared = { ...manifest.dependencies, ...manifest.peerDependencies };
  for (const file of files.filter((f) => /\.(js|d\.ts)$/.test(f))) {
    const code = readFileSync(join(pkg, file), "utf8");
    for (const [, name] of code.matchAll(/(?:from|import\()\s*"([^".][^"]*)"/g)) {
      const base = name
        .split("/")
        .slice(0, name.startsWith("@") ? 2 : 1)
        .join("/");
      expect(base in declared, `${file}: ${base} 가 dependencies 에 없다`);
    }
    if (file.endsWith(".js"))
      expect(code.startsWith('"use client"'), `${file}: "use client" 가 없다`);
  }

  // CHANGELOG 에 이 버전의 항목이 있다
  const changelog = readFileSync(join(pkg, "CHANGELOG.md"), "utf8");
  expect(
    changelog.includes(`\n## ${manifest.version}\n`),
    `CHANGELOG.md 에 ${manifest.version} 항목이 없다`,
  );

  if (problems.length === 0)
    console.log(`✔ ${manifest.name}@${manifest.version} (파일 ${files.length}개)`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}

for (const problem of problems) console.error(`✘ ${problem}`);
if (problems.length > 0) process.exit(1);
