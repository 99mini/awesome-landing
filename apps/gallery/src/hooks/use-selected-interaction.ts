import { useLocation, useNavigate, useSearchParams } from "react-router";

const PARAM = "interaction";

interface GalleryState {
  /** 갤러리 안에서 열었는지 — 닫을 때 history 를 되돌릴지 결정 */
  openedInGallery?: boolean;
}

/**
 * 선택된 인터랙션을 `?interaction=<slug>` 쿼리로 관리한다.
 * - 직접 URL 접근 시 바로 모달이 열린다.
 * - 갤러리에서 연 경우 닫기 = 뒤로가기 (Back 버튼으로 닫아도 동일하게 동작)
 */
export function useSelectedInteraction() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const slug = params.get(PARAM);

  function open(next: string) {
    setParams(
      (prev) => {
        prev.set(PARAM, next);
        return prev;
      },
      { state: { openedInGallery: true } satisfies GalleryState, preventScrollReset: true },
    );
  }

  function close() {
    if ((location.state as GalleryState | null)?.openedInGallery) {
      navigate(-1);
      return;
    }
    setParams(
      (prev) => {
        prev.delete(PARAM);
        return prev;
      },
      { replace: true, preventScrollReset: true },
    );
  }

  /** 모달 안에서 다른 인터랙션으로 — history 를 쌓지 않아 닫기/뒤로가기는 여전히 한 번에 갤러리로 */
  function replace(next: string) {
    setParams(
      (prev) => {
        prev.set(PARAM, next);
        return prev;
      },
      { replace: true, state: location.state, preventScrollReset: true },
    );
  }

  return { slug, open, close, replace };
}
