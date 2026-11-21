import { loadSources, type SourceFile } from "@awesome/interactions/registry";
import { useEffect, useMemo, useState } from "react";
import { highlight } from "sugar-high";
import * as css from "./SourceViewer.css.ts";

export function SourceViewer({ slug }: { slug: string }) {
  const [files, setFiles] = useState<SourceFile[] | null>(null);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadSources(slug).then((loaded) => {
      if (!cancelled) setFiles(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const file = files?.[active];
  const html = useMemo(() => (file ? safeHighlight(file.code) : null), [file]);

  async function handleCopy() {
    if (!file) return;
    try {
      await navigator.clipboard.writeText(file.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 권한이 없으면 코드 블록을 선택할 수 있도록 그대로 둔다
    }
  }

  if (!files) return <div className={css.status}>Loading source…</div>;

  return (
    <section className={css.viewer} aria-label="소스 코드">
      <div className={css.toolbar}>
        <div className={css.tabs} role="tablist">
          {files.map((f, i) => (
            <button
              key={f.name}
              type="button"
              role="tab"
              id={`source-tab-${i}`}
              aria-selected={i === active}
              aria-controls="source-panel"
              className={css.tab}
              onClick={() => setActive(i)}
            >
              {f.name}
            </button>
          ))}
        </div>
        <button type="button" className={css.copy} onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre
        id="source-panel"
        role="tabpanel"
        aria-labelledby={`source-tab-${active}`}
        className={css.code}
        tabIndex={0}
      >
        {html === null ? (
          <code>{file?.code}</code>
        ) : (
          // 우리 레포의 소스를 sugar-high 로 하이라이트한 결과라 신뢰할 수 있다
          // oxlint-disable-next-line react/no-danger
          <code dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </pre>
    </section>
  );
}

/** 하이라이트에 실패해도 앱 전체가 깨지지 않도록 원문으로 대체 */
function safeHighlight(code: string) {
  try {
    return highlight(code, { lang: "typescript" });
  } catch {
    return null;
  }
}
