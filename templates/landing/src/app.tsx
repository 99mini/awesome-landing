import { ScrollReveal, SplitText } from "@awesome/interactions";
import * as css from "./app.css.ts";

export function App() {
  return (
    <main className={css.hero}>
      <h1>
        <SplitText text="__TITLE__" />
      </h1>
      <ScrollReveal delay={0.4}>
        <p>Start building your landing here.</p>
      </ScrollReveal>
    </main>
  );
}
