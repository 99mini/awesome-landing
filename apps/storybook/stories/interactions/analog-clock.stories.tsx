// 자동 생성 — `pnpm stories:gen` 으로 다시 만든다. 직접 고치지 말 것.
import Demo from "@awesome/interactions/demo/analog-clock";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { interactionStory } from "../../src/interaction-story.ts";

const story = interactionStory("analog-clock");

const meta = {
  title: "Interactions/Analog Clock",
  component: Demo,
  args: story.args,
  argTypes: story.argTypes,
  parameters: { docs: { description: { component: story.description } } },
} satisfies Meta<typeof Demo>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
