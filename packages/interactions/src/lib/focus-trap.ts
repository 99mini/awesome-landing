const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** 지금 Tab 으로 갈 수 있는 요소들 (보이지 않거나 inert 인 것은 뺀다) */
export function tabbables(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) =>
      el.tabIndex >= 0 &&
      !el.closest("[inert]") &&
      el.checkVisibility({ visibilityProperty: true, opacityProperty: false }),
  );
}

/**
 * Tab 이 root 의 끝에 닿으면 반대쪽 끝으로 — 모달 밖으로 빠져나가지 않게.
 * keydown(Tab) 에서 부른다.
 */
export function trapTab(event: KeyboardEvent, root: HTMLElement) {
  const list = tabbables(root);
  const first = list[0];
  const last = list.at(-1);
  if (!first || !last) {
    event.preventDefault();
    return;
  }
  const active = document.activeElement;
  const outside = !root.contains(active);
  if (event.shiftKey && (outside || active === first)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (outside || active === last)) {
    event.preventDefault();
    first.focus();
  }
}
