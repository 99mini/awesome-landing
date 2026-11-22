import type { ControlValues } from "../types.ts";
import { CompareSlider } from "./compare-slider.tsx";
import * as css from "./demo.css.ts";

function Screen({ finished }: { finished: boolean }) {
  const tone = finished ? css.finished : css.sketch;
  return (
    <div className={`${css.screen} ${tone.screen}`}>
      <span className={`${css.tag} ${tone.tag}`}>{finished ? "After" : "Before"}</span>
      <div className={`${css.hero} ${tone.hero}`} />
      <span className={`${css.heading} ${tone.heading}`}>Reading list</span>
      <span className={`${css.line} ${tone.line}`} />
      <span className={`${css.line} ${css.short} ${tone.line}`} />
    </div>
  );
}

export default function Demo({ step }: ControlValues) {
  return (
    <CompareSlider
      className={css.slider}
      handleClassName={css.handle}
      label="Compare before and after"
      step={step}
      before={<Screen finished={false} />}
      after={<Screen finished />}
    />
  );
}
