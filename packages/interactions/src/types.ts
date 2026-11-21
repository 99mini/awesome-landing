import type { ComponentType } from "react";

export type InteractionCategory = "cursor" | "scroll" | "hover" | "text" | "layout";

export interface InteractionMeta {
  /** URL slug — 폴더 이름과 동일하게 */
  slug: string;
  title: string;
  description: string;
  category: InteractionCategory;
  tags?: string[];
  /**
   * 갤러리에 "다시 보기" 버튼을 노출할지 (기본 true).
   * 등장 애니메이션처럼 한 번 재생되는 인터랙션은 true,
   * hover·pointer 처럼 사용자가 직접 계속 조작하는 인터랙션은 false.
   */
  replayable?: boolean;
}

/** 각 인터랙션 폴더의 `demo.tsx` 가 export 해야 하는 모양 */
export interface InteractionDemoModule {
  meta: InteractionMeta;
  default: ComponentType;
}
