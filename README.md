# awesome-landing

멋진 랜딩 페이지 예제와 재사용 가능한 UX 인터랙션 모음.

**Stack** — React 19 · TypeScript 7 · Vite 8 (Rolldown/Oxc) · Motion (Framer Motion) · oxlint · oxfmt · pnpm workspace · mise

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
│  └─ interactions/         # @awesome/interactions — 재사용 인터랙션 컴포넌트
│     └─ src/<slug>/
│        ├─ Component.tsx   #   실제 구현 (index.ts 에서 export)
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

**인터랙션** — `packages/interactions/src/<slug>/` 에 컴포넌트와 `demo.tsx`(`meta` + default export)를 만들고, `src/index.ts` 에 export 추가. 갤러리 `/interactions/<slug>` 에 자동 노출.

## 스크립트

| 명령                         | 설명                         |
| ---------------------------- | ---------------------------- |
| `pnpm dev` / `pnpm dev:all`  | 갤러리 / 전체 dev 서버       |
| `pnpm build`                 | 전체 빌드                    |
| `pnpm check`                 | fmt:check + lint + typecheck |
| `pnpm fmt` / `pnpm lint:fix` | 포맷 / 린트 자동 수정        |

## 규칙

- 의존성 버전은 `pnpm-workspace.yaml` 의 `catalog` 에서만 관리하고 각 패키지에선 `"catalog:"` 로 참조.
- 애니메이션은 `motion/react` 사용, `useReducedMotion` 으로 접근성 대응.
- 워크스페이스 패키지는 빌드 없이 TS 소스를 직접 export (Vite 가 처리).
