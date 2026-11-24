/**
 * 페이지에 보이는 글 — 아래 숫자(단어 수)는 이 글에서 센다. 지어낸 수치 없음.
 * Shipnote 는 예시를 위한 가상의 제품이고, 대화 속 이름도 가상의 인물이다.
 */

export const THREAD = [
  { who: "Mina", text: "Did the billing fix ship, or is it still behind the flag?" },
  { who: "Joon", text: "Only annual plans. Monthly waits for the migration." },
  { who: "Ara", text: "Export moved too. Did anyone tell support?" },
] as const;

export const NOTE = {
  title: "Billing, release 4.2",
  items: [
    { tag: "Fixed", text: "Right tax line for annual plans. Monthly follows." },
    { tag: "Changed", text: "Export moved to the invoice menu." },
  ],
} as const;

export const STEPS = [
  {
    title: "Write it once",
    text: "Shipnote drafts the note from the commits in the pull request. You trim it instead of starting from a blank page.",
  },
  {
    title: "Review in place",
    text: "Comments sit on the line they are about, so a question gets answered where the answer will be read.",
  },
  {
    title: "Publish everywhere",
    text: "The same note goes to the changelog, the team channel and the email digest when the change ships.",
  },
] as const;

export const DESTINATIONS = ["Changelog", "Team channel", "Email digest"] as const;

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** 위 두 글의 실제 단어 수 */
export const COUNTS = {
  thread: THREAD.reduce((sum, m) => sum + words(m.text), 0),
  note: words(NOTE.title) + NOTE.items.reduce((sum, i) => sum + words(`${i.tag} ${i.text}`), 0),
};
