# @99mini/interactions

React interactions built on [Motion](https://motion.dev). Each component ships its behavior and structure only: you bring the look with your own classes, in Tailwind v4 or plain CSS.

- Keyboard support for every gesture, focus handling for every overlay
- Honors `prefers-reduced-motion`
- Labels you can translate
- Motion's feature bundle loads after the first paint

## Install

```sh
npm install @99mini/interactions motion
```

Requires React 18.3+ or 19, and Motion 12, 13 or 14.

## Set up

Wrap your app once, and import the stylesheet.

```tsx
import { MotionProvider } from "@99mini/interactions/motion";

root.render(
  <MotionProvider>
    <App />
  </MotionProvider>,
);
```

With Tailwind v4, import the stylesheet into the `components` layer so that your utilities win:

```css
@import "tailwindcss";
@import "@99mini/interactions/style.css" layer(components);
```

Without Tailwind, a plain import is enough. The styles sit in `@layer awesome`, so any unlayered CSS of yours overrides them:

```css
@import "@99mini/interactions/style.css";
```

## Use

```tsx
import { PhotoViewer } from "@99mini/interactions";

<PhotoViewer
  className="grid grid-cols-3 gap-2"
  triggerClassName="aspect-square rounded-lg"
  items={photos.map((photo) => ({
    id: photo.id,
    label: photo.title,
    thumbnail: <img className="size-full object-cover" src={photo.small} alt={photo.title} />,
    content: <img src={photo.large} alt={photo.title} />,
  }))}
/>;
```

## What is inside

| Kind    | Components                                                        |
| ------- | ----------------------------------------------------------------- |
| Overlay | `CommandPalette`, `MorphModal`, `PhotoViewer`, `ToastStack`       |
| Gesture | `CompareSlider`, `ReorderList`, `SwipeCards`                      |
| Cursor  | `CursorFollower`, `MagneticButton`, `TiltCard`                    |
| Scroll  | `Parallax`, `ScrollHighlight`, `ScrollReveal`, `StickyStory`      |
| Text    | `CountUp`, `NumberTicker`, `SplitText`, `TextScramble`            |
| Layout  | `Accordion`, `AnalogClock`, `LineDraw`, `Marquee`, `SevenSegment` |
| Hooks   | `useViewTransition`, `useTransitionName`                          |

Props are documented in the type declarations (the comments are in Korean).

## License

MIT
