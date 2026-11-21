# awesome-landing

랜딩 페이지 예제 + UX 인터랙션 컬렉션. 구조/명령은 README.md 참고.

- 툴 버전은 mise(`mise.toml`)로 관리. corepack 사용 안 함.
- 의존성 추가 시 `pnpm-workspace.yaml` catalog 에 버전을 넣고 패키지에선 `"catalog:"`.
- 애니메이션은 `motion/react` import. 모든 인터랙션은 `useReducedMotion` 대응.
- 스타일은 vanilla-extract `*.css.ts` (컴포넌트 옆, `import * as css from "./X.css.ts"`). 토큰은 `@awesome/theme` 의 `vars`.
  인터랙션 컴포넌트(`packages/interactions/src/<slug>/Component.tsx`)는 테마 import 금지 — 데모(`demo.css.ts`)만 사용.
  motion value 와 layout 애니메이션용 `borderRadius` 만 inline style 허용.
- 새 Vite 앱은 `vanillaExtractPlugin()` 필수. 워크스페이스 패키지의 `.css.ts` 는 앱 플러그인이 컴파일한다.
- 새 인터랙션: `packages/interactions/src/<slug>/{Component.tsx,Component.css.ts,demo.tsx,demo.css.ts}` + `src/index.ts` export. 계속 조작하는 인터랙션은 `meta.replayable: false`. 숫자 props 는 `meta.controls` 로 노출하고 데모는 `ControlValues` 를 props 로 받아 컴포넌트에 전달.
- 갤러리 소스 보기는 `?source` 쿼리(apps/gallery/vite/source-plugin.ts). `.css.ts` 는 VE 가 가로채므로 `?raw` 를 쓰지 말 것.
- 새 랜딩: `pnpm new:landing <name> "Title"`.
- 변경 후 `pnpm check` 통과 확인.
