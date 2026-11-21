import type { ComponentType } from "react";

export type InteractionCategory = "cursor" | "scroll" | "hover" | "text" | "layout";

export interface InteractionMeta {
  /** URL slug — 폴더 이름과 동일하게 */
  slug: string;
  title: string;
  description: string;
  category: InteractionCategory;
  tags?: string[];
}

/** 각 인터랙션 폴더의 `demo.tsx` 가 export 해야 하는 모양 */
export interface InteractionDemoModule {
  meta: InteractionMeta;
  default: ComponentType;
}
