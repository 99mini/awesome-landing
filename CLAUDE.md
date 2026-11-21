# awesome-landing

랜딩 페이지 예제 + UX 인터랙션 컬렉션. 구조/명령은 README.md 참고.

- 툴 버전은 mise(`mise.toml`)로 관리. corepack 사용 안 함.
- 파일명은 kebab-case (`interaction-modal.tsx`, `use-selected-interaction.ts`). oxlint `unicorn/filename-case` 가 error 로 검사한다. 컴포넌트 이름(export)은 PascalCase 그대로.
- 의존성 추가 시 `pnpm-workspace.yaml` catalog 에 버전을 넣고 패키지에선 `"catalog:"`.
- 애니메이션은 `motion/react` import. 모든 인터랙션은 `useReducedMotion` 대응.
- 스타일은 vanilla-extract `*.css.ts` (컴포넌트 옆, `import * as css from "./X.css.ts"`). 토큰은 `@awesome/theme` 의 `vars`.
  인터랙션 컴포넌트(`packages/interactions/src/<slug>/<slug>.tsx`)는 테마 import 금지 — 데모(`demo.css.ts`)만 사용.
  motion value 와 layout 애니메이션용 `borderRadius` 만 inline style 허용.
- 새 Vite 앱은 `vanillaExtractPlugin()` 필수. 워크스페이스 패키지의 `.css.ts` 는 앱 플러그인이 컴파일한다.
- 공유 `.css.ts`(`styles/ui.css.ts`, `@awesome/theme`) 수정 후 클래스 해시가 어긋난 현상이 한 번 있었으나 재현되지 않는다 (단일·다중 파일 동시 수정, 일시적 import 오류, 수정 직후 oxfmt 모두 확인). 테마·global 스타일 변경은 entry 까지 올라가 전체 새로고침되며, entry 는 `import.meta.hot.data` 로 root 를 재사용한다. 그래도 클래스와 스타일이 어긋나면 dev 서버 재시작.
- 갤러리 UI 강조색(`vars.color.accent`)은 선택·상태·포커스에만. 데모 안의 강조는 `vars.color.signal`/`signalAlt`.
- 새 인터랙션: `packages/interactions/src/<slug>/{<slug>.tsx,<slug>.css.ts,demo.tsx,demo.css.ts}` + `src/index.ts` export. 계속 조작하는 인터랙션은 `meta.replayable: false`. 숫자 props 는 `meta.controls` 로 노출하고 데모는 `ControlValues` 를 props 로 받아 컴포넌트에 전달.
- 갤러리 소스 보기는 `?source` 쿼리(apps/gallery/vite/source-plugin.ts). `.css.ts` 는 VE 가 가로채므로 `?raw` 를 쓰지 말 것.
- 새 랜딩: `pnpm new:landing <name> "Title"`.
- 변경 후 `pnpm check` 통과 확인. 갤러리·랜딩 동작을 바꿨다면 `pnpm test:e2e` (Playwright, production 빌드를 vite preview 로 띄워 검사).
  테스트는 `e2e/tests/*.spec.ts` — 셀렉터는 role·aria·텍스트로 (production 빌드의 VE 클래스 이름은 해시라 쓸 수 없다).
- CI(`.github/workflows/ci.yml`)는 PR 마다 check+build, e2e, `audit:design all` 을 돌린다.

## 디자인 기준 (Hallmark Floor 중 우리 스택에 맞는 것)

AI 가 만든 티가 나는 기본값을 피한다. 랜딩·데모·갤러리 UI 모두에 적용.

- 색과 글꼴은 토큰으로만: `@awesome/theme` 의 `vars`, 랜딩은 자체 `theme.css.ts`(`createGlobalTheme`). 컴포넌트 스타일에 색 리터럴·`#000`/`#fff` 금지.
- `transition: all` 금지. `width`·`height`·`top`·`left` 애니메이션 금지 — `transform`·`opacity` 만.
- 모든 애니메이션은 `prefers-reduced-motion` 대응. 모든 인터랙티브 요소는 즉시 나타나는 `:focus-visible`.
- 제목 안의 한 단어만 이탤릭·색·굵기로 강조 금지. 제목은 한 스타일.
- eyebrow(제목 위 작은 라벨)·자간 넓힌 대문자 라벨(15px 이하 uppercase 또는 letter-spacing > 0.03em) 금지. 워드마크·`<time>`·바이라인은 예외.
- 템플릿 구두점 금지: `A · B · C` 중점 나열, 버튼/링크 뒤 화살표(`Get started →`), 본문의 em/en 대시. 마키 구분자는 예외.
- 지어낸 수치·후기·로고 금지. 숫자는 실제 값이거나 페이지에서 계산한 값.
- 보라→파랑/분홍, 시안-온-다크 그라디언트 금지. 블러 블롭은 그 움직임이 데모 대상일 때만 (CSS 에 `Hallmark · waive 29` 주석으로 근거 기록).
- 히어로는 제목 + 한 문장 + 액션. 1440×900 한 화면에 약 80단어 이하.
- 제목은 `overflow-wrap: break-word; min-width: 0`, 이미지 그리드는 `minmax(0, 1fr)`, `100vw` 금지 (reset 이 `overflow-x: clip` 처리).
- 디자인 검사: `pnpm skills:install` 후 `pnpm audit:design <landing|gallery|all>`.
  빌드된 CSS 까지 검사하므로 26a/26b(포커스·active)도 실제로 판정된다 — FAIL 이면 진짜 문제.
  render 검사에는 puppeteer-core 가 필요 — 전역 설치 대신 `HALLMARK_PUPPETEER=<puppeteer-core 가 설치된 폴더>`.
  waive·dismissed 는 `.css.ts` 의 `/* Hallmark · waive <gate> · <근거> */` 주석으로 남기면 검사에 반영된다.
