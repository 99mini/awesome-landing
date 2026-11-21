import {
  controlDefaults,
  findInteraction,
  type InteractionControls,
} from "@awesome/interactions/registry";
import type { ArgTypes } from "@storybook/react-vite";

/** 갤러리 조절기 정의(meta.controls)를 Storybook 컨트롤로 옮긴다 — 정의는 한 곳(데모)에만 둔다 */
function argTypesFrom(controls: InteractionControls = {}): ArgTypes {
  return Object.fromEntries(
    Object.entries(controls).map(([key, c]) => [
      key,
      c.kind === "toggle"
        ? { name: c.label, control: { type: "inline-radio" }, options: [0, 1] }
        : {
            name: c.label,
            control: { type: "range", min: c.min, max: c.max, step: c.step },
            description: c.unit ? `단위: ${c.unit}` : undefined,
          },
    ]),
  );
}

/**
 * 레지스트리의 인터랙션 하나를 스토리 재료로 (args·argTypes·설명).
 * 컴포넌트는 스토리 파일이 데모를 직접 import 한다 — 레지스트리의 lazy 컴포넌트를 쓰면
 * 렌더 직후 fallback 이 먼저 그려져 axe 가 빈 화면을 검사할 수 있다.
 */
export function interactionStory(slug: string) {
  const mod = findInteraction(slug);
  if (!mod) throw new Error(`unknown interaction: ${slug}`);
  return {
    args: controlDefaults(mod.meta.controls),
    argTypes: argTypesFrom(mod.meta.controls),
    description: mod.meta.description,
  };
}
