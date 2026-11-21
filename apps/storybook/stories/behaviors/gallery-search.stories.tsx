import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { SearchCombobox } from "../../../gallery/src/components/search-combobox.tsx";

/**
 * 부모(갤러리에서는 URL)가 값을 늦게 돌려주는 상황 — 라우터가 따라오기 전에 다음 키가 들어오면
 * 예전에는 글자가 빠졌다 (#20). 30ms 늦게 반영하는 부모로 그 상황을 재현한다.
 */
function LaggyParent({ onPick }: { onPick: (kind: string, value: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <SearchCombobox
      value={value}
      onChange={(next) => setTimeout(() => setValue(next), 30)}
      onPick={onPick}
    />
  );
}

const meta = {
  title: "Gallery/Search",
  component: LaggyParent,
  args: { onPick: fn() },
  parameters: { layout: "padded" },
} satisfies Meta<typeof LaggyParent>;

export default meta;

export const FastTypingKeepsEveryCharacter: StoryObj<typeof meta> = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox", { name: "Search interactions" });
    await userEvent.type(input, "parallax", { delay: null });
    await expect(input).toHaveValue("parallax");
    await userEvent.clear(input);
    await userEvent.type(input, "seven", { delay: null });
    await expect(input).toHaveValue("seven");
  },
};

export const PickATagWithTheKeyboard: StoryObj<typeof meta> = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "Search interactions" });
    await userEvent.type(input, "stag");
    await waitFor(() => expect(canvas.getByRole("listbox", { name: "Suggestions" })).toBeVisible());
    // 입력하는 동안에는 아무것도 자동 선택하지 않는다
    await expect(input).not.toHaveAttribute("aria-activedescendant");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(args.onPick).toHaveBeenCalledWith("tag", "stagger");
  },
};
