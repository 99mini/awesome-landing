import { ScrollReveal, SplitText } from "@awesome/interactions";

export function App() {
  return (
    <main className="hero">
      <h1>
        <SplitText text="__TITLE__" />
      </h1>
      <ScrollReveal delay={0.4}>
        <p>Start building your landing here.</p>
      </ScrollReveal>
    </main>
  );
}
