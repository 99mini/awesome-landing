// 사용법: pnpm stories:gen [--check]
// packages/interactions/src/<slug>/meta.ts 마다 apps/storybook/stories/interactions/<slug>.stories.tsx 를 만든다.
// --check: 생성 결과가 커밋된 파일과 다르면 실패 (CI 용 — 새 인터랙션의 스토리를 빠뜨리지 않게)
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const source = join(root, "packages/interactions/src");
const out = join(root, "apps/storybook/stories/interactions");
const check = process.argv.includes("--check");

const slugs = readdirSync(source, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(source, d.name, "meta.ts")))
  .map((d) => d.name)
  .toSorted();

const template = (
  slug,
  title,
) => `// 자동 생성 — \`pnpm stories:gen\` 으로 다시 만든다. 직접 고치지 말 것.
import Demo from "@99mini/interactions/demo/${slug}";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { interactionStory } from "../../src/interaction-story.ts";

const story = interactionStory(${JSON.stringify(slug)});

const meta = {
  title: ${JSON.stringify(`Interactions/${title}`)},
  component: Demo,
  args: story.args,
  argTypes: story.argTypes,
  parameters: { docs: { description: { component: story.description } } },
} satisfies Meta<typeof Demo>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
`;

const expected = new Map(
  slugs.map((slug) => {
    const meta = readFileSync(join(source, slug, "meta.ts"), "utf8");
    const title = meta.match(/title:\s*"([^"]+)"/)?.[1] ?? slug;
    return [`${slug}.stories.tsx`, template(slug, title)];
  }),
);

const existing = existsSync(out) ? readdirSync(out).filter((f) => f.endsWith(".stories.tsx")) : [];
const stale = existing.filter((f) => !expected.has(f));
const changed = [...expected].filter(
  ([file, body]) => !existsSync(join(out, file)) || readFileSync(join(out, file), "utf8") !== body,
);

if (check) {
  if (stale.length || changed.length) {
    console.error("✖ 스토리가 인터랙션 목록과 맞지 않습니다. `pnpm stories:gen` 을 실행하세요.");
    for (const f of stale) console.error(`  - 지울 파일: ${f}`);
    for (const [f] of changed) console.error(`  - 만들거나 고칠 파일: ${f}`);
    process.exit(1);
  }
  console.log(`✔ 스토리 ${expected.size}개가 최신입니다.`);
} else {
  for (const f of stale) rmSync(join(out, f));
  for (const [file, body] of changed) writeFileSync(join(out, file), body);
  console.log(
    `✔ 스토리 ${expected.size}개 (새로 쓰거나 고침 ${changed.length}, 지움 ${stale.length})`,
  );
}
