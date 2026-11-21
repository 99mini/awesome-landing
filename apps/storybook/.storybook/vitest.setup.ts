import * as a11yAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react-vite";
import { MotionGlobalConfig } from "motion/react";
import * as projectAnnotations from "./preview.ts";

setProjectAnnotations([a11yAnnotations, projectAnnotations]);

// 테스트에서는 Motion 애니메이션을 즉시 끝낸다 — axe 가 페이드 중간의 흐린 색으로 대비를 재거나,
// 닫힘 애니메이션이 끝나기를 기다리다 시간 초과가 나지 않게. (rAF 로 직접 그리는 데모는 영향 없음)
MotionGlobalConfig.skipAnimations = true;
