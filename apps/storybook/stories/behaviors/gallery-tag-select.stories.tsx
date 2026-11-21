import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { TagSelect, type SelectOption } from "../../../gallery/src/components/tag-select.tsx";

const OPTIONS: SelectOption[] = [
  { value: null, label: "Any" },
  { value: "spring", label: "spring", meta: "2" },
  { value: "stagger", label: "stagger", meta: "2" },
  { value: "SVG", label: "SVG", meta: "3" },
];

function Controlled({ onChange }: { onChange: (v: string | null) => void }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <TagSelect
      label="Tag"
      value={value}
      options={OPTIONS}
      onChange={(v) => {
        setValue(v);
        onChange(v);
      }}
    />
  );
}

const meta = {
  title: "Gallery/Tag select",
  component: Controlled,
  args: { onChange: fn() },
} satisfies Meta<typeof Controlled>;

export default meta;

export const Keyboard: StoryObj<typeof meta> = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox", { name: "Tag: Any" });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    // 열림 애니메이션은 테스트에서 즉시 끝나지만, 첫 프레임은 초기 상태라 기다린다
    await waitFor(() => expect(canvas.getByRole("listbox", { name: "Tag" })).toBeVisible());
    // 글자를 치면 그 글자로 시작하는 항목으로
    await userEvent.keyboard("st{Enter}");
    await expect(args.onChange).toHaveBeenLastCalledWith("stagger");
    await expect(trigger).toHaveAccessibleName("Tag: stagger");
    await expect(trigger).toHaveFocus();
    await expect(canvas.queryByRole("listbox")).toBeNull();
  },
};

export const EscapeKeepsValue: StoryObj<typeof meta> = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);
    await userEvent.keyboard("{ArrowDown}{Escape}");
    await waitFor(() => expect(canvas.queryByRole("listbox")).toBeNull());
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
