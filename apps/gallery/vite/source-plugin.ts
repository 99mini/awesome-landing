import { readFile } from "node:fs/promises";
import type { Plugin } from "vite";

const QUERY = "?source";
const PREFIX = "\0source:";
// id 가 `.css.ts` 로 끝나면 vanilla-extract 가 다시 가로채므로 확장자를 바꿔 둔다
const SUFFIX = ".source.js";

/**
 * `import code from "./X.css.ts?source"` → 파일 원문 문자열.
 *
 * `?raw` 를 쓰지 않는 이유: vanilla-extract 플러그인이 쿼리와 상관없이 `.css.ts` 를
 * 가로채 스타일 모듈로 컴파일해서 원문을 얻을 수 없다.
 * 가상 모듈 id 로 바꿔 다른 플러그인이 건드리지 않게 한다.
 */
export function sourcePlugin(): Plugin {
  return {
    name: "awesome:source",
    enforce: "pre",
    async resolveId(id, importer) {
      if (!id.endsWith(QUERY)) return null;
      const resolved = await this.resolve(id.slice(0, -QUERY.length), importer, { skipSelf: true });
      return resolved ? PREFIX + resolved.id + SUFFIX : null;
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) return null;
      const file = id.slice(PREFIX.length, -SUFFIX.length);
      this.addWatchFile(file);
      return `export default ${JSON.stringify(await readFile(file, "utf8"))};`;
    },
  };
}
