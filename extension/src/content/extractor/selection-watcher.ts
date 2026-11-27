import { isComposerElement } from '../adapters/site-adapters.ts';

export function attachSelectionWatcher(
  onSelectionCaptured: (text: string, rect: DOMRect) => void
): () => void {
  const handleMouseUp = () => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

      const anchorEl = sel.anchorNode instanceof Element
        ? sel.anchorNode
        : sel.anchorNode?.parentElement ?? null;
      if (anchorEl?.closest('#rizzboard-wingman-host') || isComposerElement(anchorEl)) {
        return;
      }

      const raw = sel.toString().replace(/\s+/g, ' ').trim();
      if (raw.length < 3 || raw.length > 320) return;

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        onSelectionCaptured(raw, rect);
      }
    }, 30);
  };

  document.addEventListener('mouseup', handleMouseUp, true);
  return () => document.removeEventListener('mouseup', handleMouseUp, true);
}
