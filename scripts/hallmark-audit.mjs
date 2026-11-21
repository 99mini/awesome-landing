// Hallmark 디자인 감사 — 빌드 → vite preview → sloplint(정적 + 렌더)
//
// 사용법: pnpm audit:design <target|all> [--genre <genre>] [--scope page|app]
//   target: gallery, landings/* 폴더 이름 (editorial, aurora, index ...)
//   (`pnpm audit` 은 pnpm 내장 보안 감사 명령이라 이름을 audit:design 으로 둔다)
//
// 왜 빌드를 거치나: 스타일이 vanilla-extract(.css.ts)라 소스에는 .css 가 없다.
// sloplint 는 .css 만 읽으므로, 빌드된 dist/assets/*.css 를 함께 넘겨야
// :focus-visible·:active 같은 규칙(26a/26b)을 실제로 판정한다.
//
// 스탬프: Hallmark 스탬프·waive·dismissed 는 .css.ts 안의 주석으로 쓰지만 빌드가 주석을 지운다.
// 그래서 소스에 직접 쓴 `Hallmark ·` 주석만 모아 빌드된 CSS 맨 앞에 다시 붙인다.
// 소스에 없는 스탬프를 만들어 내지는 않는다 — 없으면 gate 20 이 그대로 FAIL 이다.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(new URL("..", import.meta.url).pathname);
const sloplint = join(root, ".claude/skills/hallmark/scripts/sloplint.mjs");

/** 대상별 기본 장르·범위. 목록에 없는 랜딩은 editorial 로 본다 */
const DEFAULTS = {
  gallery: { genre: "modern-minimal", scope: "app" },
  aurora: { genre: "atmospheric" },
  editorial: { genre: "editorial" },
  index: { genre: "modern-minimal" },
};

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const target = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));

function targetDir(name) {
  return name === "gallery" ? join(root, "apps/gallery") : join(root, "landings", name);
}

function allTargets() {
  const landings = readdirSync(join(root, "landings")).filter((d) =>
    existsSync(join(root, "landings", d, "landing.json")),
  );
  return ["gallery", ...landings];
}

if (!target) {
  console.error("usage: pnpm audit:design <target|all> [--genre <genre>] [--scope page|app]");
  console.error(`targets: ${allTargets().join(", ")}, all`);
  process.exit(2);
}

if (!existsSync(sloplint)) {
  console.error("Hallmark 스킬이 없습니다. 먼저 `pnpm skills:install` 을 실행하세요.");
  process.exit(2);
}

/** sloplint 의 렌더 검사와 포커스 검사가 쓰는 puppeteer-core 위치 (없으면 null) */
function resolvePuppeteer() {
  const roots = [process.env.HALLMARK_PUPPETEER, root].filter(Boolean);
  const npmRoot = spawnSync("npm", ["root", "-g"], { encoding: "utf8" }).stdout?.trim();
  if (npmRoot) roots.push(join(npmRoot, ".."));
  for (const dir of roots) {
    try {
      return createRequire(join(dir, "noop.js")).resolve("puppeteer-core");
    } catch {}
  }
  return null;
}

const CHROMES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

/**
 * 요소별 포커스 검사 (sloplint 26a 보완).
 * sloplint 의 26a 는 "페이지 CSS 어딘가에 :focus-visible 이 있는가"만 본다. 번들에 다른 컴포넌트의
 * 포커스 규칙이 하나라도 있으면 통과하므로, 특정 링크·버튼에 링이 빠진 것은 놓친다.
 * 여기서는 Tab 으로 실제 포커스를 옮기며, 브라우저 기본 링(outline: auto)만 보이거나
 * 포커스 전후로 아무것도 달라지지 않는 요소를 찾는다.
 */
async function focusAudit(puppeteerPath, url) {
  const chrome = CHROMES.find((p) => p && existsSync(p));
  if (!chrome) return { skipped: "Chrome 을 찾지 못함 (CHROME_PATH 로 지정)" };
  const puppeteer = (await import(pathToFileURL(puppeteerPath).href)).default;
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));
    const misses = [];
    const seen = new Set();
    for (let i = 0; i < 200; i++) {
      // oxlint-disable-next-line no-await-in-loop
      await page.keyboard.press("Tab");
      // oxlint-disable-next-line no-await-in-loop
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const label = `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 32)}"`;
        const id = el.dataset.focusAuditId ?? (el.dataset.focusAuditId = String(Math.random()));
        const focused = getComputedStyle(el);
        const ring = {
          outline: `${focused.outlineStyle} ${focused.outlineWidth}`,
          shadow: focused.boxShadow,
        };
        // 포커스를 잠시 빼서 평소 모습과 비교
        el.blur();
        const rest = getComputedStyle(el);
        const restRing = {
          outline: `${rest.outlineStyle} ${rest.outlineWidth}`,
          shadow: rest.boxShadow,
        };
        el.focus({ focusVisible: true, preventScroll: true });
        return { id, label, ring, restRing, uaOnly: focused.outlineStyle === "auto" };
      });
      if (!info) continue;
      if (seen.has(info.id)) break;
      seen.add(info.id);
      const unchanged =
        info.ring.outline === info.restRing.outline && info.ring.shadow === info.restRing.shadow;
      if (info.uaOnly || unchanged) {
        misses.push(
          `${info.label}: ${info.uaOnly ? "browser default ring only" : "no visible change on focus"}`,
        );
      }
    }
    return { checked: seen.size, misses };
  } finally {
    await browser.close();
  }
}

/**
 * sloplint 73(다른 요소 아래 깔린 글자)을 다시 확인한다.
 * sloplint 는 글자 사각형의 중심에 무엇이 있는지만 보고, 조상의 overflow 로 잘려 보이지 않는
 * 글자(예: 카드 안에서 흐르는 마키)도 겹침으로 센다. 같은 방식으로 훑되, 그 점이 overflow 조상의
 * 상자 밖이면(잘려서 화면에 없으면) 제외한다. 남는 것이 진짜 겹침이다.
 */
async function occlusionRecheck(puppeteerPath, url) {
  const chrome = CHROMES.find((p) => p && existsSync(p));
  if (!chrome) return null;
  const puppeteer = (await import(pathToFileURL(puppeteerPath).href)).default;
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));
    return await page.evaluate(async () => {
      // 아래 skip·vis·unseen·숨김 조상 판정은 sloplint 의 observeOcclusion 과 같다 — 다른 점은 clipped 하나뿐
      const skip =
        'script, style, noscript, svg, [aria-hidden="true"], nav, header, dialog, [popover], [role="menu"], details:not([open]), [hidden]';
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const vis = (el) => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0)
          return false;
        const r = el.getBoundingClientRect();
        return r.width > 3 && r.height > 3;
      };
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const unseen = (el) => {
        const cs = getComputedStyle(el);
        return (
          parseFloat(cs.opacity) < 0.05 ||
          (/^(transparent|rgba\(0, 0, 0, 0\))$/.test(cs.backgroundColor) &&
            cs.backgroundImage === "none" &&
            !(el.innerText || "").trim() &&
            !/^(IMG|svg|CANVAS|VIDEO|PICTURE)$/.test(el.tagName) &&
            !el.querySelector("img, svg, canvas, video"))
        );
      };
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const hiddenByAncestor = (el) => {
        for (let p = el; p && p !== document.body; p = p.parentElement) {
          const cs = getComputedStyle(p);
          if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0)
            return true;
        }
        return false;
      };
      // page.evaluate 안에서 직렬화돼 브라우저에서 실행되므로 바깥으로 뺄 수 없다
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const pinned = (el) => {
        for (let p = el; p && p !== document.body; p = p.parentElement)
          if (/fixed|sticky/.test(getComputedStyle(p).position)) return true;
        return false;
      };
      // 점이 overflow 로 잘리는 조상 상자 밖이면 화면에 그려지지 않는다
      // page.evaluate 안에서 직렬화돼 브라우저에서 실행되므로 바깥으로 뺄 수 없다
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const clipped = (el, x, y) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const cs = getComputedStyle(p);
          if (cs.overflowX === "visible" && cs.overflowY === "visible") continue;
          const r = p.getBoundingClientRect();
          if (x < r.left || x > r.right || y < r.top || y > r.bottom) return true;
        }
        return false;
      };
      const runs = [];
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let t = tw.nextNode(); t; t = tw.nextNode()) {
        const host = t.parentElement;
        if (!t.textContent.trim() || !host || host.closest(skip)) continue;
        if (hiddenByAncestor(host) || host.closest("[data-slot]") || !vis(host)) continue;
        runs.push({ t, host });
      }
      const real = [];
      const H = document.documentElement.scrollHeight;
      for (let y = 0; y < H; y += Math.max(200, innerHeight - 100)) {
        window.scrollTo(0, y);
        // oxlint-disable-next-line no-await-in-loop
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        for (const { t, host } of runs) {
          if (pinned(host)) continue;
          const rg = document.createRange();
          rg.selectNodeContents(t);
          for (const q of rg.getClientRects()) {
            if (q.width < 6 || q.height < 6) continue;
            const cx = q.left + q.width / 2;
            const cy = q.top + q.height / 2;
            if (cy < 0 || cy >= innerHeight || cx < 0 || cx >= innerWidth) continue;
            if (clipped(host, cx, cy)) continue;
            const ghost = getComputedStyle(host).pointerEvents === "none";
            if (ghost) host.style.setProperty("pointer-events", "auto", "important");
            const top = document.elementFromPoint(cx, cy);
            if (ghost) host.style.removeProperty("pointer-events");
            if (
              !top ||
              top === host ||
              host.contains(top) ||
              top.contains(host) ||
              pinned(top) ||
              unseen(top)
            )
              continue;
            real.push(`${top.tagName.toLowerCase()} over "${t.textContent.trim().slice(0, 16)}"`);
            break;
          }
        }
      }
      window.scrollTo(0, 0);
      return real;
    });
  } finally {
    await browser.close();
  }
}

/** 스탬프 본문(theme:/idea:, 또는 checked:)이 맨 앞, 그다음 critique, 나머지(waive/dismissed/answered) */
const stampRank = (line) =>
  /· (theme|idea|checked):/.test(line) ? 0 : /· critique:/.test(line) ? 1 : 2;

/** src 아래 .css.ts 에서 `Hallmark ·` 로 시작하는 블록 주석을 한 줄짜리로 모은다 */
function authoredStamps(dir) {
  const lines = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".css.ts")) {
        for (const m of readFileSync(p, "utf8").matchAll(/\/\*([\s\S]*?)\*\//g)) {
          const text = m[1]
            .split("\n")
            .map((l) => l.replace(/^\s*\*?\s?/, "").trim())
            .filter(Boolean)
            .join(" ");
          if (/^Hallmark\s*·/.test(text)) lines.push(`/* ${text} */`);
        }
      }
    }
  };
  walk(join(dir, "src"));
  return lines.toSorted((a, b) => stampRank(a) - stampRank(b));
}

function stampBuiltCss(dir) {
  const stamps = authoredStamps(dir);
  if (!stamps.length) return 0;
  const assets = join(dir, "dist", "assets");
  for (const f of readdirSync(assets).filter((n) => n.endsWith(".css"))) {
    const p = join(assets, f);
    writeFileSync(p, `${stamps.join("\n")}\n${readFileSync(p, "utf8")}`);
  }
  return stamps.length;
}

function viteBin(dir) {
  const req = createRequire(join(dir, "package.json"));
  const pkgPath = req.resolve("vite/package.json");
  const bin = JSON.parse(readFileSync(pkgPath, "utf8")).bin;
  return join(pkgPath, "..", typeof bin === "string" ? bin : bin.vite);
}

function freePort(start) {
  return new Promise((ok) => {
    const server = createServer();
    server.once("error", () => ok(freePort(start + 1)));
    server.listen(start, "127.0.0.1", () => server.close(() => ok(start)));
  });
}

async function waitFor(url, ms = 20_000) {
  const until = Date.now() + ms;
  // 서버가 뜰 때까지 순서대로 폴링한다
  while (Date.now() < until) {
    try {
      // oxlint-disable-next-line no-await-in-loop
      if ((await fetch(url)).ok) return true;
    } catch {}
    // oxlint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

async function audit(name, render) {
  const dir = targetDir(name);
  if (!existsSync(join(dir, "package.json"))) {
    console.error(`알 수 없는 대상: ${name}`);
    return { name, fails: 1, error: "unknown target" };
  }
  const opts = { ...DEFAULTS[name] };
  if (flag("--genre")) opts.genre = flag("--genre");
  if (flag("--scope")) opts.scope = flag("--scope");
  opts.genre ??= "editorial";

  const vite = viteBin(dir);
  console.log(`\n▸ ${name}: build`);
  // --base ./ : 빌드된 index.html 이 CSS 를 상대 경로로 링크해야 sloplint 가 파일로 따라간다
  // (갤러리처럼 base 가 "/" 이면 `/assets/…` 를 파일 시스템 루트로 해석해 html·body 규칙을 놓친다)
  const build = spawnSync(process.execPath, [vite, "build", "--base", "./", "--logLevel", "warn"], {
    cwd: dir,
    stdio: "inherit",
  });
  if (build.status !== 0) return { name, fails: 1, error: "build failed" };
  const stamped = stampBuiltCss(dir);
  console.log(
    `▸ ${name}: ${stamped ? `${stamped} authored Hallmark comment(s) carried into dist CSS` : "no authored Hallmark stamp in src"}`,
  );

  let preview;
  let url;
  if (render) {
    const port = await freePort(5320);
    url = `http://127.0.0.1:${port}/`;
    preview = spawn(
      process.execPath,
      [vite, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
      { cwd: dir, stdio: "ignore" },
    );
    if (!(await waitFor(url))) {
      preview.kill();
      return { name, fails: 1, error: `preview did not start on ${url}` };
    }
  }

  try {
    const lintArgs = [
      sloplint,
      join(dir, "src"),
      join(dir, "dist"),
      "--genre",
      opts.genre,
      "--json",
    ];
    if (opts.scope) lintArgs.push("--scope", opts.scope);
    if (url) lintArgs.push("--url", url);
    console.log(
      `▸ ${name}: sloplint --genre ${opts.genre}${opts.scope ? ` --scope ${opts.scope}` : ""}${url ? ` --url ${url}` : ""}`,
    );
    const run = spawnSync(process.execPath, lintArgs, {
      cwd: root,
      encoding: "utf8",
      env: process.env,
    });
    let report;
    try {
      report = JSON.parse(run.stdout);
    } catch {
      console.error(run.stderr || run.stdout);
      return { name, fails: 1, error: "sloplint output was not JSON" };
    }
    let fails = report.summary.fails;
    // 73 이 overflow 로 잘린 글자 때문이면(화면에 없음) 확인된 오탐으로 내린다
    const occlusion = (report.findings ?? []).find((f) => f.gate === "73" && f.grade === "FAIL");
    if (occlusion && url && puppeteerPath) {
      const real = await occlusionRecheck(puppeteerPath, url);
      if (real && real.length === 0) {
        occlusion.grade = "DISMISSED";
        occlusion.evidence +=
          " — rechecked: the covered text is clipped by an overflow ancestor and never painted";
        fails -= 1;
      } else if (real) {
        occlusion.evidence += ` — rechecked, real overlaps: ${real.slice(0, 3).join("; ")}`;
      }
    }
    printReport(name, report);
    if (url && puppeteerPath) {
      const focus = await focusAudit(puppeteerPath, url);
      if (focus.skipped) console.log(`  focus check skipped: ${focus.skipped}`);
      else {
        for (const m of focus.misses) console.log(`  FAIL   26a  ${m}  (focus walk)`);
        console.log(
          `  focus walk: ${focus.checked} focusable, ${focus.misses.length} without our ring`,
        );
        fails += focus.misses.length;
      }
    }
    return { name, fails, reflex: report.summary.reflex };
  } finally {
    preview?.kill();
  }
}

function printReport(name, report) {
  const { summary, findings = [] } = report;
  const dismissed = findings.filter((f) => f.grade === "DISMISSED").length;
  const order = { FAIL: 0, REFLEX: 1, WARN: 2, DISMISSED: 3 };
  const shown = findings
    .filter((f) => f.grade in order)
    .toSorted((a, b) => order[a.grade] - order[b.grade]);
  for (const f of shown) {
    const where = f.file?.startsWith("http")
      ? "render"
      : `${f.file?.replace(`${root}/`, "")}:${f.line}`;
    console.log(`  ${f.grade.padEnd(6)} ${String(f.gate).padEnd(4)} ${f.evidence}  (${where})`);
    if (f.grade === "FAIL" || f.grade === "REFLEX") console.log(`  ${"".padEnd(11)}→ ${f.fix}`);
  }
  console.log(
    `  ${name}: ${summary.fails - dismissed} FAIL · ${summary.reflex} REFLEX · ${summary.warns} WARN${dismissed ? ` · ${dismissed} dismissed after recheck` : ""} · render ${summary.render}`,
  );
}

const puppeteerPath = resolvePuppeteer();
const render = Boolean(puppeteerPath);
if (!render) {
  console.warn(
    [
      "⚠ puppeteer-core 를 찾지 못해 렌더 검사(대비·접힘·겹침 등)는 건너뜁니다. 정적 검사만 실행합니다.",
      "  렌더 검사를 하려면 전역 설치 대신 별도 폴더에 설치하고 경로를 넘기세요:",
      "    npm i --prefix ~/.cache/hallmark-puppeteer puppeteer-core",
      "    HALLMARK_PUPPETEER=~/.cache/hallmark-puppeteer pnpm audit:design <target>",
    ].join("\n"),
  );
}

const targets = target === "all" ? allTargets() : [target];
const results = [];
// 대상마다 빌드·preview 포트를 쓰므로 하나씩 순서대로
// oxlint-disable-next-line no-await-in-loop
for (const t of targets) results.push(await audit(t, render));

if (results.length > 1) {
  console.log("\n요약");
  for (const r of results) {
    console.log(`  ${r.name.padEnd(12)} ${r.error ?? `${r.fails} FAIL · ${r.reflex} REFLEX`}`);
  }
}
process.exit(results.some((r) => r.fails > 0) ? 1 : 0);
