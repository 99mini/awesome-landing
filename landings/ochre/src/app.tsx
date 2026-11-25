import {
  CompareSlider,
  NumberTicker,
  StickyStory,
  ToastStack,
  type Toast,
} from "@99mini/interactions";
import { useRef, useState } from "react";
import * as css from "./app.css.ts";
import { COUNTS, DESTINATIONS, NOTE, STEPS, THREAD } from "./content.ts";

/** 릴리스 노트 한 장 — 히어로와 비교 슬라이더의 "뒤" 화면 */
function NoteCard() {
  return (
    <figure className={css.note} aria-label="Release note">
      <p className={css.noteTitle}>{NOTE.title}</p>
      <ul className={css.noteList}>
        {NOTE.items.map((item) => (
          <li key={item.tag} className={css.noteItem}>
            <span className={css.tag}>{item.tag}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** 같은 내용이 대화로 흩어진 모습 — 비교 슬라이더의 "앞" 화면 */
function Thread() {
  return (
    <figure className={css.thread} aria-label="Team chat thread">
      {THREAD.map((message, i) => (
        <p key={i} className={css.message}>
          <span className={css.who}>{message.who}</span>
          {message.text}
        </p>
      ))}
    </figure>
  );
}

/** 사용 흐름의 단계마다 바뀌는 그림 */
function StepVisual({ step }: { step: number }) {
  return (
    <div className={css.visual} aria-hidden>
      {step === 0 && (
        <div className={css.visualStack}>
          <code className={css.commit}>fix(billing): tax line for annual plans</code>
          <code className={css.commit}>feat(export): move export to the invoice menu</code>
          <div className={css.drafted}>Drafted from 2 commits</div>
        </div>
      )}
      {step === 1 && (
        <div className={css.visualStack}>
          <div className={css.reviewLine}>Older invoices keep the old line.</div>
          <div className={css.comment}>
            <span className={css.who}>Ara</span>
            Say which invoice is correct.
          </div>
          <div className={css.reviewLine}>
            Older invoices keep the old line; the next one is correct.
          </div>
        </div>
      )}
      {step === 2 && (
        <ul className={css.destinations}>
          {DESTINATIONS.map((d) => (
            <li key={d} className={css.destination}>
              <svg className={css.check} viewBox="0 0 16 16" width="18" height="18">
                <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);
  const notify = (toast: Omit<Toast, "id">) =>
    setToasts((all) => [...all, { id: next.current++, ...toast }]);

  // 진짜 동작만 — 링크 복사는 실제로 복사하고, 가입은 예시 페이지라 아무것도 보내지 않았다고 알린다
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(location.href);
      notify({ title: "Link copied", body: location.href });
    } catch {
      notify({ title: "Could not copy", body: "Copy the address from the browser bar." });
    }
  }
  const requestAccess = () =>
    notify({
      title: "Nothing was sent",
      body: "This is an example page. Shipnote is not a real product.",
    });

  return (
    <>
      <header className={css.header}>
        <span className={css.wordmark}>Shipnote</span>
        <button type="button" className={css.secondary} onClick={requestAccess}>
          Request access
        </button>
      </header>

      <main>
        <section className={css.hero} aria-labelledby="hero-title">
          <div className={css.heroText}>
            <h1 id="hero-title" className={css.title}>
              Ship the change, not the meeting.
            </h1>
            <p className={css.lead}>
              Shipnote turns a pull request into one note the whole team reads.
            </p>
            <div className={css.actions}>
              <a className={css.primary} href="#how">
                See how it works
              </a>
              <button type="button" className={css.secondary} onClick={copyLink}>
                Copy page link
              </button>
            </div>
          </div>
          <div className={css.heroSlot}>
            <NoteCard />
          </div>
        </section>

        <section id="how" className={css.section} aria-labelledby="how-title">
          <h2 id="how-title" className={css.heading}>
            How a change ships
          </h2>
          <StickyStory
            className={css.story}
            steps={STEPS.map((s, i) => (
              <div key={s.title} className={css.step}>
                <span className={css.stepNumber}>{i + 1}</span>
                <h3 className={css.stepTitle}>{s.title}</h3>
                <p className={css.muted}>{s.text}</p>
              </div>
            ))}
            renderVisual={(active) => <StepVisual step={active} />}
          />
        </section>

        <section className={css.section} aria-labelledby="compare-title">
          <h2 id="compare-title" className={css.heading}>
            One note instead of a thread
          </h2>
          <CompareSlider
            className={css.compare}
            handleClassName={css.handle}
            label="Compare the chat thread with the release note"
            initial={55}
            before={<Thread />}
            after={
              <div className={css.compareAfter}>
                <div className={css.compareNote}>
                  <NoteCard />
                </div>
              </div>
            }
          />
          <dl className={css.counts}>
            <div className={css.count}>
              <dt className={css.muted}>Thread words</dt>
              <dd className={css.countValue}>
                <NumberTicker value={COUNTS.thread} />
              </dd>
            </div>
            <div className={css.count}>
              <dt className={css.muted}>Note words</dt>
              <dd className={css.countValue}>
                <NumberTicker value={COUNTS.note} />
              </dd>
            </div>
          </dl>
        </section>

        <section className={css.closing} aria-labelledby="closing-title">
          <h2 id="closing-title" className={css.statement}>
            Try it on your next release.
          </h2>
          <button type="button" className={css.primary} onClick={requestAccess}>
            Request access
          </button>
        </section>
      </main>

      <footer className={css.footer}>
        <p className={css.muted}>
          Ochre is an example landing from awesome-landing. Shipnote is not a real product.
        </p>
      </footer>

      <ToastStack
        className={css.toasts}
        toastClassName={css.toast}
        toasts={toasts}
        duration={5}
        onDismiss={(id) => setToasts((all) => all.filter((t) => t.id !== id))}
      />
    </>
  );
}
