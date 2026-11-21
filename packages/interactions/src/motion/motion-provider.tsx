import { LazyMotion } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("./motion-features.ts").then((mod) => mod.default);

/**
 * 인터랙션 컴포넌트는 `motion.*` 대신 가벼운 `m.*` 를 쓴다 — 애니메이션 기능은 이 공급자가
 * 첫 화면을 그린 뒤 따로 받아 붙인다. 인터랙션을 쓰는 앱의 루트를 한 번 감싸면 된다.
 * 공급자 밖의 `m.*` 는 정적인 요소로만 그려진다 (애니메이션 없음).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
