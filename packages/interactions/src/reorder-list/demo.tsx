import { useState } from "react";
import { ReorderList } from "./reorder-list.tsx";
import * as css from "./demo.css.ts";

const INITIAL = ["Design", "Prototype", "Test", "Ship"] as const;

export default function Demo() {
  const [items, setItems] = useState<(typeof INITIAL)[number][]>([...INITIAL]);

  return (
    <ReorderList
      className={css.list}
      itemClassName={css.item}
      handleClassName={css.handle}
      items={items}
      onReorder={setItems}
      renderItem={(item) => <span>{item}</span>}
    />
  );
}
