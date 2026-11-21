import type { ControlValues, InteractionControls } from "@awesome/interactions/registry";
import * as css from "./controls-panel.css.ts";

interface ControlsPanelProps {
  controls: InteractionControls;
  values: ControlValues;
  onChange: (key: string, value: number) => void;
  onReset: () => void;
}

export function ControlsPanel({ controls, values, onChange, onReset }: ControlsPanelProps) {
  return (
    <section className={css.panel} aria-label="Props 조절">
      <div className={css.header}>
        <h3 className={css.heading}>Props</h3>
        <button type="button" className={css.reset} onClick={onReset}>
          Reset
        </button>
      </div>
      {Object.entries(controls).map(([key, c]) => {
        const value = values[key] ?? c.default;
        if (c.kind === "toggle") {
          return (
            <label key={key} className={css.row}>
              <span>{c.label}</span>
              <input
                type="checkbox"
                className={css.toggle}
                checked={value === 1}
                onChange={(e) => onChange(key, e.currentTarget.checked ? 1 : 0)}
              />
              <output className={css.value}>{value === 1 ? "On" : "Off"}</output>
            </label>
          );
        }
        return (
          <label key={key} className={css.row}>
            <span>{c.label}</span>
            <input
              type="range"
              className={css.range}
              min={c.min}
              max={c.max}
              step={c.step}
              value={value}
              onChange={(e) => onChange(key, e.currentTarget.valueAsNumber)}
            />
            <output className={css.value}>
              {formatValue(value, c.step)}
              {c.unit}
            </output>
          </label>
        );
      })}
    </section>
  );
}

/** step 의 소수 자릿수에 맞춰 표시 */
function formatValue(value: number, step: number) {
  const decimals = step.toString().split(".")[1]?.length ?? 0;
  return value.toFixed(decimals);
}
