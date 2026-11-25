# awesome-landing

멋진 랜딩 페이지 예제와 재사용 가능한 UX 인터랙션 모음.

**Stack** — React 19 · TypeScript 7 · Vite 8 (Rolldown/Oxc) · Motion (Framer Motion) · vanilla-extract · oxlint · oxfmt · pnpm workspace · mise

## 시작하기

```sh
mise install        # node 24, pnpm 12 (mise.toml)
pnpm install
pnpm dev            # 갤러리 → http://localhost:5173
pnpm dev:all        # 갤러리 + 모든 랜딩 동시 실행
```

## 구조

```
.
├─ apps/
│  └─ gallery/              # 허브: 랜딩 목록 + 인터랙션 데모 뷰어 (:5173)
├─ landings/                # 랜딩 예제 — 각각 독립된 Vite 앱
│  └─ aurora/               #   landing.json(메타·포트) 으로 갤러리에 자동 노출 (:5200~)
├─ packages/
│  ├─ theme/                # @awesome/theme — 디자인 토큰(--al-*) + 공통 reset
│  └─ interactions/         # @99mini/interactions — 재사용 인터랙션 컴포넌트
│     └─ src/<slug>/
│        ├─ <slug>.tsx      #   실제 구현 (index.ts 에서 export)
│        └─ demo.tsx        #   meta + 데모 → 갤러리에 자동 등록
├─ examples/tailwind/       # 바깥 프로젝트처럼 빌드된 패키지를 Tailwind v4 로 쓰는 예제 (:5400, E2E 대상)
├─ templates/landing/       # new:landing 이 복사하는 템플릿
├─ scripts/new-landing.mjs
├─ pnpm-workspace.yaml      # workspace + catalog(공통 버전)
├─ tsconfig.base.json
├─ .oxlintrc.json / .oxfmtrc.json
└─ mise.toml
```

## 추가하기

**랜딩** — `pnpm new:landing neon-saas "Neon SaaS"` → `pnpm install` → `landing.json` 설명/태그 수정.

**인터랙션** — `packages/interactions/src/<slug>/` 에 컴포넌트와 `demo.tsx`(`meta` + default export)를 만들고, `src/index.ts` 에 export 추가. 갤러리(`/?interaction=<slug>`)에 자동 노출. 계속 직접 조작하는 인터랙션(hover·pointer)은 `meta.replayable: false`. 조절 가능한 숫자 props 는 `meta.controls` 에 정의하면 모달에 슬라이더가 생기고 데모에 props 로 전달된다. 모달에서 폴더의 소스(컴포넌트·스타일·데모)를 보고 복사할 수 있다.

## 다른 앱에서 쓰기 (Tailwind v4 포함)

`@99mini/interactions` 는 JS · 타입 · CSS 파일 하나로 빌드된다 (`pnpm --filter @99mini/interactions build` → `dist/`).
쓰는 쪽은 vanilla-extract 플러그인이 필요 없다 — `motion`·`react` 만 있으면 된다.

```tsx
import { MotionProvider } from "@99mini/interactions/motion";
import { CommandPalette } from "@99mini/interactions";

root.render(
  <MotionProvider>
    <App />
  </MotionProvider>,
);
```

CSS 는 `@layer awesome` 안에 있어서, 쓰는 쪽의 클래스가 우선순위와 상관없이 덮어쓴다. 모양은 `className`·`panelClassName` 등으로 준다.

```css
/* Tailwind v4 — 반드시 layer(components) 로. 그래야 utilities 가 이긴다 */
@import "tailwindcss";
@import "@99mini/interactions/style.css" layer(components);
```

```css
/* 레이어를 쓰지 않는 일반 CSS — 그냥 가져오면 된다 (레이어 밖의 CSS 가 언제나 이긴다) */
@import "@99mini/interactions/style.css";
```

Tailwind 에서 `layer(...)` 없이 가져오면 `awesome` 레이어가 utilities 뒤에 선언되어 패키지 스타일이 이긴다 — `examples/tailwind` 와
`e2e/tests/tailwind.spec.ts` 가 이것을 확인한다.

## npm 배포 (`@99mini/interactions`)

배포물은 빌드 결과(JS · 타입 · CSS)와 README · LICENSE · CHANGELOG 뿐이다. 레지스트리·데모·소스 경로는 저장소 안에서만 쓰이고
(`publishConfig.exports` 가 지운다), 개발용 항목은 `.pnpmfile.mjs` 가 뺀다. `pnpm check:package` 가 tarball 을 만들어 확인한다 (CI).

새 버전: `packages/interactions/package.json` 의 `version` 과 `CHANGELOG.md` 를 함께 올려 병합한 뒤
Actions → **Release** → Run workflow (기본은 dry-run).

토큰은 쓰지 않는다. npmjs.com 의 패키지 Settings → Trusted publishing → GitHub Actions 에 한 번 등록한다:
`99mini` / `awesome-landing` / `release.yml`, Environment 는 비우고 Allowed actions 에서 `npm publish` 를 켠다.

- 등록하고 2일 안에 배포에 성공해야 한다(아니면 만료) — 배포 직전에 등록한다.
- `package.json` 의 `repository.url` 이 이 저장소와 정확히 같아야 한다 (`check:package` 가 확인).
- 배포에 성공하면 Settings → Publishing access 에서 2FA 를 요구하고 토큰을 막는다.

## 스크립트

| 명령                         | 설명                         |
| ---------------------------- | ---------------------------- |
| `pnpm dev` / `pnpm dev:all`  | 갤러리 / 전체 dev 서버       |
| `pnpm build`                 | 전체 빌드                    |
| `pnpm check`                 | fmt:check + lint + typecheck |
| `pnpm fmt` / `pnpm lint:fix` | 포맷 / 린트 자동 수정        |

## 테스트와 CI

```sh
pnpm test:e2e      # Playwright — 앱마다 production 빌드 후 vite preview(4310, 4320~4322)로 띄워 앱 흐름을 검사
pnpm storybook     # Storybook (http://localhost:6006)
pnpm test:stories  # 모든 스토리를 브라우저에서 렌더 + play 함수 + axe 접근성 검사
pnpm stories:gen   # 인터랙션마다 스토리 생성 (registry 의 meta.controls → Storybook 컨트롤)
pnpm test:visual   # 화면 회귀 — 기준 이미지는 CI 컨테이너 것이라 로컬에서는 안정성 확인용
```

로컬은 설치된 Chrome, CI 는 Playwright 의 Chromium 을 쓴다. PR 마다 GitHub Actions 가
`pnpm check` + `pnpm build`, E2E, 화면 회귀, Storybook 테스트, `pnpm audit:design all` 을 돌린다.
화면을 일부러 바꿨다면 PR 에 `update-snapshots` 라벨을 붙여 CI 가 기준 이미지를 다시 만들게 한다 (`.github/workflows/ci.yml`).

## 디자인 품질 (Hallmark)

[Hallmark](https://github.com/Nutlope/hallmark) 스킬을 프로젝트 범위로 쓴다. 본체는 커밋하지 않고 `skills-lock.json` 으로 버전을 고정한다.

```sh
pnpm skills:install                 # .claude/skills/hallmark 복원
pnpm audit:design editorial         # 빌드 → vite preview(5320~) → sloplint 정적 + 렌더
pnpm audit:design gallery           # 갤러리는 --scope app
pnpm audit:design all
# 렌더 검사(대비·접힘·겹침)에는 puppeteer-core 가 필요 — 전역 설치 대신
HALLMARK_PUPPETEER=<puppeteer-core 설치 폴더> pnpm audit:design all
```

빌드된 `dist/assets/*.css` 를 함께 검사하므로 VE 스타일의 `:focus-visible`·`:active`(26a/26b)도 실제로 판정된다.
`.css.ts` 에 쓴 `/* Hallmark · ... */` 스탬프·waive·dismissed 주석은 빌드된 CSS 맨 앞으로 옮겨서 검사한다. FAIL 이 있으면 exit 1.

Claude Code 에서는 `/hallmark audit <path>`, 새 페이지는 `/hallmark custom ...` 으로 방향을 잡고 구현은 이 레포 구조(React + VE + Motion)로 옮긴다. 지켜야 할 기준은 CLAUDE.md 의 "디자인 기준".

## 규칙

- 의존성 버전은 `pnpm-workspace.yaml` 의 `catalog` 에서만 관리하고 각 패키지에선 `"catalog:"` 로 참조.
- 애니메이션은 `motion/react` 사용, `useReducedMotion` 으로 접근성 대응.
- 컴포넌트는 가벼운 `m.*` 를 쓰고, 애니메이션 기능은 `MotionProvider`(`LazyMotion`)가 첫 화면 뒤에 받는다.
  인터랙션을 쓰는 앱은 루트를 한 번 감싼다:

  ```tsx
  import { MotionProvider } from "@99mini/interactions/motion";
  root.render(
    <MotionProvider>
      <App />
    </MotionProvider>,
  );
  ```

- 스타일은 vanilla-extract(`*.css.ts`)로 컴포넌트 옆에 둔다. 전역 `.css` 파일·string className 은 쓰지 않는다.
  - 색·반경·폰트·이징은 `@awesome/theme` 의 `vars` 토큰 사용 (CSS 변수 `--al-*`, 외부에서 덮어쓰기 가능).
  - 인터랙션 컴포넌트는 구조 스타일만 갖고, 겉모습은 `className` 과 CSS 변수로 열어 둔다. 테마에 의존하지 않는다.
  - Motion 의 motion value(x, y, rotate 등)와 Motion 레이아웃 애니메이션이 보정하는 `borderRadius` 는 inline `style` 로 둔다.
- 워크스페이스 패키지는 빌드 없이 TS 소스를 직접 export (Vite 가 처리).
