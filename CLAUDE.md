# awesome-landing

랜딩 페이지 예제 + UX 인터랙션 컬렉션. 구조/명령은 README.md 참고.

- 툴 버전은 mise(`mise.toml`)로 관리. corepack 사용 안 함.
- 의존성 추가 시 `pnpm-workspace.yaml` catalog 에 버전을 넣고 패키지에선 `"catalog:"`.
- 애니메이션은 `motion/react` import. 모든 인터랙션은 `useReducedMotion` 대응.
- 새 인터랙션: `packages/interactions/src/<slug>/{Component.tsx,demo.tsx}` + `src/index.ts` export.
- 새 랜딩: `pnpm new:landing <name> "Title"`.
- 변경 후 `pnpm check` 통과 확인.
