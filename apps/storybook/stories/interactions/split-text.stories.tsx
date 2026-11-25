// 자동 생성 — `pnpm stories:gen` 으로 다시 만든다. 직접 고치지 말 것.
import Demo from "@99mini/interactions/demo/split-text";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { interactionStory } from "../../src/interaction-story.ts";

const story = interactionStory("split-text");

const meta = {
  title: "Interactions/Split Text Reveal",
  component: Demo,
  args: story.args,
  argTypes: story.argTypes,
  parameters: { docs: { description: { component: story.description } } },
} satisfies Meta<typeof Demo>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
