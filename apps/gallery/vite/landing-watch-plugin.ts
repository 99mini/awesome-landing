import { resolve, sep } from "node:path";
import type { Plugin } from "vite";

/**
 * 앱 루트 밖의 `landings/<name>/landing.json` 을 감시한다.
 *
 * Vite 는 앱 루트 안의 파일만 감시하므로, 랜딩을 새로 만들거나 지워도
 * `src/landings.ts` 의 `import.meta.glob` 결과가 갱신되지 않았다 (dev 서버 재시작 필요).
 * 추가·변경·삭제 시 그 모듈을 무효화하고 페이지를 새로 고친다.
 */
export function landingWatchPlugin(): Plugin {
  return {
    name: "awesome:landing-watch",
    apply: "serve",
    configureServer(server) {
      const landingsDir = resolve(server.config.root, "../../landings");
      const globModule = resolve(server.config.root, "src/landings.ts");
      server.watcher.add(landingsDir);

      const onFile = (file: string) => {
        if (!file.startsWith(landingsDir + sep) || !file.endsWith(`${sep}landing.json`)) return;
        const graph = server.environments.client.moduleGraph;
        for (const mod of graph.getModulesByFile(globModule) ?? []) {
          graph.invalidateModule(mod);
        }
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", onFile);
      server.watcher.on("change", onFile);
      server.watcher.on("unlink", onFile);
    },
  };
}
