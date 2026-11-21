// 사용법: pnpm dev:all
// 랜딩은 landing.json 의 포트로 고정(strictPort)되어 있어서, 포트가 이미 쓰이고 있으면
// vite 가 "pnpm recursive run failed" 만 남기고 멈춘다. 먼저 포트를 확인해 어떤 랜딩이 왜 못 뜨는지 알려 준다.
import { spawn } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { connect } from "node:net";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const landingsDir = join(root, "landings");

async function readLandings() {
  const dirs = await readdir(landingsDir, { withFileTypes: true });
  const metas = await Promise.all(
    dirs
      .filter((d) => d.isDirectory())
      .map(async (d) => {
        try {
          const meta = JSON.parse(
            await readFile(join(landingsDir, d.name, "landing.json"), "utf8"),
          );
          return { name: d.name, port: Number(meta.port) };
        } catch {
          return null;
        }
      }),
  );
  return metas.filter((m) => m && Number.isInteger(m.port));
}

/** 그 포트에서 누가 이미 듣고 있으면 true (IPv4·IPv6 둘 다 확인) */
function isListening(port) {
  const probe = (host) =>
    new Promise((resolve) => {
      const socket = connect({ port, host });
      socket.setTimeout(400);
      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.once("timeout", () => {
        socket.destroy();
        resolve(false);
      });
      socket.once("error", () => resolve(false));
    });
  return Promise.all([probe("127.0.0.1"), probe("::1")]).then((r) => r.some(Boolean));
}

const landings = await readLandings();
const listening = await Promise.all(landings.map((l) => isListening(l.port)));
const busy = landings.filter((_, i) => listening[i]);

if (busy.length > 0) {
  console.error("\n✖ dev:all 을 시작할 수 없습니다. 랜딩 포트가 이미 사용 중입니다.\n");
  for (const { name, port } of busy) {
    console.error(`  • landings/${name} → 포트 ${port}`);
  }
  console.error("\n  누가 쓰고 있는지 확인:");
  for (const { port } of busy) {
    console.error(`    lsof -nP -iTCP:${port} -sTCP:LISTEN`);
  }
  console.error(
    "\n  보통 이전에 띄운 dev 서버가 남아 있는 경우입니다. 그 터미널을 종료하거나 위 명령의 PID 를 kill 한 뒤 다시 실행하세요.\n" +
      "  (랜딩은 갤러리 링크가 포트를 기준으로 하기 때문에 다른 포트로 자동으로 옮기지 않습니다. 포트를 바꾸려면 landing.json 의 port 를 수정)\n",
  );
  process.exit(1);
}

const child = spawn(
  "pnpm",
  ["-r", "--parallel", "--filter", "./apps/*", "--filter", "./landings/*", "dev"],
  { cwd: root, stdio: "inherit" },
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
