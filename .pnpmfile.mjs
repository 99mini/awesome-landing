/** 배포물에는 개발용 항목을 남기지 않는다 — 비공개 워크스페이스 패키지 이름(@awesome/theme)이 새어 나가지 않게 */
export const hooks = {
  beforePacking(manifest) {
    delete manifest.devDependencies;
    delete manifest.scripts;
    return manifest;
  },
};
