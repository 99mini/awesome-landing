# awesome-landing

랜딩 페이지 예제 + UX 인터랙션 컬렉션. 구조/명령은 README.md 참고.

- 툴 버전은 mise(`mise.toml`)로 관리. corepack 사용 안 함.
- 파일명은 kebab-case (`interaction-modal.tsx`, `use-selected-interaction.ts`). oxlint `unicorn/filename-case` 가 error 로 검사한다. 컴포넌트 이름(export)은 PascalCase 그대로.
- 의존성 추가 시 `pnpm-workspace.yaml` catalog 에 버전을 넣고 패키지에선 `"catalog:"`.
- 애니메이션은 `motion/react` import. 모든 인터랙션은 `useReducedMotion` 대응.
  컴포넌트는 `motion.*` 가 아니라 `m.*` (oxlint `no-restricted-imports` 가 막는다). 기능 묶음은 `MotionProvider`
  (`@awesome/interactions/motion`, `LazyMotion`)가 나중에 받으니, 새 앱·스토리 루트는 이것으로 감싼다.
  `@awesome/interactions` 는 `sideEffects` 를 `.css.ts` 로 한정 — barrel 에서 하나만 가져와도 다른 컴포넌트가 따라오지 않는다.
- 스타일은 vanilla-extract `*.css.ts` (컴포넌트 옆, `import * as css from "./X.css.ts"`). 토큰은 `@awesome/theme` 의 `vars`.
  인터랙션 컴포넌트(`packages/interactions/src/<slug>/<slug>.tsx`)는 테마 import 금지 — 데모(`demo.css.ts`)만 사용.
  motion value 와 layout 애니메이션용 `borderRadius` 만 inline style 허용.
- 새 Vite 앱은 `vanillaExtractPlugin()` 필수. 워크스페이스 패키지의 `.css.ts` 는 앱 플러그인이 컴파일한다.
- 공유 `.css.ts`(`styles/ui.css.ts`, `@awesome/theme`) 수정 후 클래스 해시가 어긋난 현상이 한 번 있었으나 재현되지 않는다 (단일·다중 파일 동시 수정, 일시적 import 오류, 수정 직후 oxfmt 모두 확인). 테마·global 스타일 변경은 entry 까지 올라가 전체 새로고침되며, entry 는 `import.meta.hot.data` 로 root 를 재사용한다. 그래도 클래스와 스타일이 어긋나면 dev 서버 재시작.
- 갤러리 UI 강조색(`vars.color.accent`)은 선택·상태·포커스에만. 데모 안의 강조는 `vars.color.signal`/`signalAlt`.
- 갤러리·Storybook·랜딩 모두 라이트/다크 둘 다. 시스템 설정을 따르고 `<html data-theme>` 로 고정된다.
  반대 테마는 `colorSchemes(base, assignVars(...))`(`@awesome/theme/color-schemes`) 로 붙인다 — 갤러리는 `@awesome/theme/modes`,
  랜딩은 각자 `theme.css.ts` 에서. 새 랜딩도 두 테마를 설계하고 대비를 계산해 주석에 남긴다.
  `signal` 은 라이트에서 진한 호박색이라 그 위 글자는 `signalInk`(테마마다 뒤집힘).
  대비는 테마마다 따로 깨질 수 있다 — Storybook 은 다크·라이트 두 프로젝트로 axe, 갤러리·랜딩 화면은 `e2e/tests/a11y.spec.ts`,
  디자인 감사는 대상마다 라이트(기본 렌더)와 `<대상>:dark` 를 따로 본다.
- 새 인터랙션: `packages/interactions/src/<slug>/{<slug>.tsx,<slug>.css.ts,meta.ts,demo.tsx,demo.css.ts}` + `src/index.ts` export, 그리고 `pnpm stories:gen` (Storybook 스토리 생성 — CI 가 `--check` 로 확인). 계속 조작하는 인터랙션은 `meta.replayable: false`. 숫자 props 는 `meta.controls` 로 노출하고 데모는 `ControlValues` 를 props 로 받아 컴포넌트에 전달.
- `meta.ts`(제목·카테고리·controls)는 첫 로드에 들어가고 `demo.tsx` 는 처음 그려질 때 받는다(레지스트리의 `default` 는 lazy).
  데모를 렌더하는 곳은 `<Suspense>` 안에 둔다. 갤러리 masonry 는 경계가 하나라 첫 화면이 한 번에 그려지고(CLS 방지),
  카드가 새로 보이거나 필터·모달 이동은 transition 이라 지금 화면을 유지한다. 데모에 meta 를 다시 넣지 말 것 — 첫 로드가 다시 커진다.
- `pnpm check:bundle` — 앱마다 첫 로드 JS(entry + 정적 import 전부)의 gzip 예산, Motion 기능 묶음이 첫 로드로 새지 않았는지, 갤러리 데모 하나·소스 보기 크기 (CI 가 build 다음에 확인).
- 갤러리 소스 보기는 `?source` 쿼리(apps/gallery/vite/source-plugin.ts). `.css.ts` 는 VE 가 가로채므로 `?raw` 를 쓰지 말 것.
- 새 랜딩: `pnpm new:landing <name> "Title"`.
- 변경 후 `pnpm check` 통과 확인. 갤러리·랜딩 동작을 바꿨다면 `pnpm test:e2e` (Playwright, production 빌드를 vite preview 로 띄워 검사).
  테스트는 `e2e/tests/*.spec.ts` — 셀렉터는 role·aria·텍스트로 (production 빌드의 VE 클래스 이름은 해시라 쓸 수 없다).
  갤러리 흐름은 데스크톱(`chromium`)과 폰(`mobile`, Pixel 7 터치) 두 번 돈다. 폰은 한 줄 배치라 카드가 화면 밖이면
  데모가 쉰다 — 카드를 `scrollIntoViewIfNeeded` 한 뒤 조작할 것. hover 로만 되는 동작은 탭으로도 되게 한다.
- 컴포넌트 테스트는 Storybook(`apps/storybook`): 모든 스토리를 브라우저에서 렌더하고 play 함수와 axe 접근성 검사를 돌린다 (`pnpm test:stories`).
  인터랙션 스토리는 생성물(`stories/interactions/`), 동작 검사는 직접 쓴다(`stories/behaviors/`). 테스트에서는 Motion 애니메이션이 즉시 끝난다.
- 화면 회귀(`e2e/tests/visual.spec.ts`)는 CI 의 Playwright 컨테이너에서만 비교한다 — 로컬 macOS 에서 찍은 이미지는 커밋하지 말 것.
  화면을 일부러 바꿨다면 PR 에 `update-snapshots` 라벨 → CI 가 새 기준 이미지를 커밋한다 → 라벨을 떼고 다시 돌려 비교 통과 확인.
- CI(`.github/workflows/ci.yml`)는 PR 마다 check+build, e2e, visual, storybook, `audit:design all` 을 돌린다.
  e2e 는 4개 job 으로 나눠(`--shard=N/4`) 동시에 돈다 — 러너 CPU 가 적어 job 안에서는 worker 1개라, 타이밍을 재는 테스트를 위해 worker 대신 job 을 늘렸다.

## 디자인 기준 (Hallmark Floor 중 우리 스택에 맞는 것)

AI 가 만든 티가 나는 기본값을 피한다. 랜딩·데모·갤러리 UI 모두에 적용.

- 색과 글꼴은 토큰으로만: `@awesome/theme` 의 `vars`, 랜딩은 자체 `theme.css.ts`(`createGlobalTheme`). 컴포넌트 스타일에 색 리터럴·`#000`/`#fff` 금지.
- `transition: all` 금지. `width`·`height`·`top`·`left` 애니메이션 금지 — `transform`·`opacity` 만.
- 모든 애니메이션은 `prefers-reduced-motion` 대응. 모든 인터랙티브 요소는 즉시 나타나는 `:focus-visible`.
- 드래그·스와이프로만 되는 조작은 없게 한다: 같은 동작을 키보드나 버튼으로도 (Reorder 는 손잡이에서 ↑/↓, Swipe 는 버튼). 갤러리 모달이 ←/→ 를 쓰므로 데모 키보드 조작은 ↑/↓ 등으로.
- 흐리게 보이는 글자도 읽혀야 한다 — 효과용으로 흐린 텍스트도 대비 기준(큰 글자 3:1)을 지킨다 (Storybook axe 가 잡는다).
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
