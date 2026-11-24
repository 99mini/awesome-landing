import {
  Accordion,
  CommandPalette,
  CompareSlider,
  LineDraw,
  MorphModal,
  NumberTicker,
  ToastStack,
  type Command,
  type Toast,
} from "@awesome/interactions";
import { useRef, useState } from "react";

const COMMANDS: Command[] = [
  { id: "add", label: "Add 100 to the counter", hint: "Counter" },
  { id: "reset", label: "Reset the counter", hint: "Counter" },
  { id: "toast", label: "Show a notification", hint: "Toast" },
];

const button =
  "inline-flex h-10 items-center rounded-full border border-stone-400 px-4 text-sm font-medium text-stone-900 hover:border-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900";

/** 패키지 컴포넌트에 Tailwind 유틸리티만으로 모양을 준다 (className · panelClassName 등) */
export function App() {
  const [count, setCount] = useState(1200);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);
  const notify = (title: string) =>
    setToasts((all) => [...all, { id: next.current++, title, body: "Styled with Tailwind." }]);

  return (
    <main className="mx-auto grid max-w-3xl gap-16 px-4 py-16 text-stone-900">
      <header className="grid gap-3">
        <h1 className="text-4xl font-bold">Interactions with Tailwind v4</h1>
        <p className="text-stone-600">
          The prebuilt package, no vanilla-extract plugin. Every look on this page comes from
          Tailwind classes.
        </p>
      </header>

      <section className="grid gap-4" aria-labelledby="counter">
        <h2 id="counter" className="text-xl font-semibold">
          Number Ticker and Command Palette
        </h2>
        {/* 첫 화면에 바로 보이는 자리 — Motion 기능 묶음이 늦게 와도 굴러가고 그려져야 한다 */}
        <div className="flex flex-wrap items-end gap-8">
          <p className="text-5xl font-bold">
            <NumberTicker value={count} locale="en-US" />
          </p>
          <LineDraw
            className="w-64 text-stone-900"
            series={[[3, 5, 4, 7, 6, 9]]}
            width={256}
            height={96}
          />
        </div>
        {/* 패널 폭: 패키지 기본값(340px)을 w-[30rem] 이 덮는다 */}
        <div className="relative min-h-72">
          <CommandPalette
            commands={COMMANDS}
            hotkey="focus"
            panelClassName="w-[30rem] rounded-2xl border border-stone-300 bg-white text-stone-900 shadow-none"
            onRun={(c) => {
              if (c.id === "add") setCount((n) => n + 100);
              if (c.id === "reset") setCount(1200);
              if (c.id === "toast") notify("Notification");
            }}
            trigger={<span className={button}>Open commands</span>}
          />
        </div>
      </section>

      <section className="grid gap-4" aria-labelledby="morph">
        <h2 id="morph" className="text-xl font-semibold">
          Morph Modal
        </h2>
        <div className="relative">
          {/* 패널 폭: 패키지 기본값(560px)을 w-[36rem] 이 덮는다 */}
          <MorphModal
            label="Details"
            contained
            className="rounded-2xl bg-stone-200 p-6"
            panelClassName="w-[36rem] rounded-2xl bg-white p-8"
            preview={<span className="font-semibold">Open the details</span>}
          >
            <p className="text-stone-700">
              The card grows into this panel. Esc or Close puts it back.
            </p>
          </MorphModal>
        </div>
      </section>

      <section className="grid gap-4" aria-labelledby="accordion">
        <h2 id="accordion" className="text-xl font-semibold">
          Accordion
        </h2>
        <Accordion
          className="divide-y divide-stone-300 border-y border-stone-300"
          items={[
            {
              id: "a",
              title: "Does it need vanilla-extract?",
              content: "No. Import one CSS file.",
            },
            {
              id: "b",
              title: "Who wins, Tailwind or the package?",
              content: "Tailwind. The package CSS sits in a lower layer.",
            },
          ]}
        />
      </section>

      <section className="grid gap-4" aria-labelledby="compare">
        <h2 id="compare" className="text-xl font-semibold">
          Compare Slider
        </h2>
        {/* 커서: 패키지 기본값(ew-resize)을 cursor-pointer 가 덮는다 */}
        <CompareSlider
          label="Compare"
          className="cursor-pointer overflow-hidden rounded-2xl text-stone-900"
          handleClassName="bg-stone-900 text-white"
          before={<div className="flex h-48 items-center bg-stone-200 pl-6 text-lg">Before</div>}
          after={
            <div className="flex h-48 items-center justify-end bg-amber-200 pr-6 text-lg">
              After
            </div>
          }
        />
      </section>

      <section className="grid gap-4" aria-labelledby="toast">
        <h2 id="toast" className="text-xl font-semibold">
          Toast Stack
        </h2>
        <button
          type="button"
          className={`${button} justify-self-start`}
          onClick={() => notify("Saved")}
        >
          Notify
        </button>
      </section>

      <ToastStack
        className="fixed right-4 bottom-4 w-80"
        toastClassName="rounded-xl border border-stone-300 bg-white text-stone-900 shadow-none"
        toasts={toasts}
        onDismiss={(id) => setToasts((all) => all.filter((t) => t.id !== id))}
      />
    </main>
  );
}
