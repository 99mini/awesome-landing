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
│  └─ interactions/         # @awesome/interactions — 재사용 인터랙션 컴포넌트
│     └─ src/<slug>/
│        ├─ <slug>.tsx      #   실제 구현 (index.ts 에서 export)
│        └─ demo.tsx        #   meta + 데모 → 갤러리에 자동 등록
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

## 스크립트

| 명령                         | 설명                         |
| ---------------------------- | ---------------------------- |
| `pnpm dev` / `pnpm dev:all`  | 갤러리 / 전체 dev 서버       |
| `pnpm build`                 | 전체 빌드                    |
| `pnpm check`                 | fmt:check + lint + typecheck |
| `pnpm fmt` / `pnpm lint:fix` | 포맷 / 린트 자동 수정        |

## 테스트와 CI

```sh
pnpm test:e2e      # Playwright — 앱마다 production 빌드 후 vite preview(4310, 4320~4322)로 띄워 검사
```

로컬은 설치된 Chrome, CI 는 Playwright 의 Chromium 을 쓴다. PR 마다 GitHub Actions 가
`pnpm check` + `pnpm build`, E2E, `pnpm audit:design all` 을 돌린다 (`.github/workflows/ci.yml`).

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
- 스타일은 vanilla-extract(`*.css.ts`)로 컴포넌트 옆에 둔다. 전역 `.css` 파일·string className 은 쓰지 않는다.
  - 색·반경·폰트·이징은 `@awesome/theme` 의 `vars` 토큰 사용 (CSS 변수 `--al-*`, 외부에서 덮어쓰기 가능).
  - 인터랙션 컴포넌트는 구조 스타일만 갖고, 겉모습은 `className` 과 CSS 변수로 열어 둔다. 테마에 의존하지 않는다.
  - Motion 의 motion value(x, y, rotate 등)와 Motion 레이아웃 애니메이션이 보정하는 `borderRadius` 는 inline `style` 로 둔다.
- 워크스페이스 패키지는 빌드 없이 TS 소스를 직접 export (Vite 가 처리).
