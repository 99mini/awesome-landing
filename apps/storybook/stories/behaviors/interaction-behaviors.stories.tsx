import { CountUp, MorphModal, SevenSegment, TextScramble } from "@awesome/interactions";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

/** 렌더만으로는 알 수 없는 동작을 확인하는 스토리들 */
const meta = {
  title: "Interactions/Behaviors",
} satisfies Meta;

export default meta;

export const TextScrambleResolves: StoryObj = {
  render: () => <TextScramble text="DECODING" duration={0.4} />,
  play: async ({ canvasElement }) => {
    // 보이는(aria-hidden) 쪽이 글리프에서 원래 글자로 풀린다
    const shown = canvasElement.querySelector("[aria-hidden]")!;
    await waitFor(() => expect(shown).toHaveTextContent("DECODING"), { timeout: 3000 });
    // 스크린 리더는 처음부터 원래 글자를 읽는다
    await expect(
      within(canvasElement).getByText("DECODING", { selector: ":not([aria-hidden])" }),
    ).toBeInTheDocument();
  },
};

export const CountUpReachesTarget: StoryObj = {
  render: () => <CountUp to={12800} duration={0.4} locale="en-US" />,
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement).toHaveTextContent("12,800"), { timeout: 3000 });
  },
};

export const SevenSegmentLabelsItsValue: StoryObj = {
  render: () => <SevenSegment value="12:34" />,
  play: async ({ canvasElement }) => {
    const display = within(canvasElement).getByRole("img", { name: "12:34" });
    // 숫자 4개 × 세그먼트 7개
    await expect(display.querySelectorAll("polygon")).toHaveLength(28);
  },
};

export const MorphModalOpensAndRestoresFocus: StoryObj = {
  render: () => (
    <MorphModal label="Details" preview={<span>Open details</span>}>
      <p>Panel content</p>
    </MorphModal>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Open details" });
    await userEvent.click(trigger);
    await expect(canvas.getByRole("dialog", { name: "Details" })).toBeVisible();
    await waitFor(() => expect(canvas.getByRole("button", { name: "Close" })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull(), { timeout: 3000 });
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
