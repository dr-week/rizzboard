import { signal } from '@zuari/signals';
import { html } from '@zuari/dom';
import { mountList, mountTemplate } from '../../services/dom-helper.ts';

export function ClipboardPanel(options: {
  history: { value: string[] };
  onSelectClip: (clip: string) => void;
  onAnalyzeClip: (clip: string) => void;
  onDeleteClip?: (clip: string) => void;
  onClearAll?: () => void;
  onClose: () => void;
}) {
  const pinnedClips = signal<string[]>([]);

  const togglePin = (clip: string) => {
    if (pinnedClips.value.includes(clip)) {
      pinnedClips.value = pinnedClips.value.filter(c => c !== clip);
    } else {
      pinnedClips.value = [clip, ...pinnedClips.value];
    }
  };

  return mountTemplate(html`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Clipboard — Tap to Paste or ⚡ Reply</span>
        <div style="display:flex; gap:8px; align-items:center;">
          ${options.onClearAll
            ? mountTemplate(html`<button class="back-link" @click=${options.onClearAll}>Clear</button>`)
            : ''}
          <button class="back-link" @click=${options.onClose}>Close ✕</button>
        </div>
      </div>
      ${() => {
        const pinned = pinnedClips.value;
        const sorted = [
          ...options.history.value.filter(c => pinned.includes(c)),
          ...options.history.value.filter(c => !pinned.includes(c))
        ];
        if (sorted.length === 0) {
          return mountTemplate(html`
            <div style="padding: 20px; text-align: center; opacity: 0.6; font-size: 13px;">
              Clipboard is empty. Copy any message to see it here.
            </div>
          `);
        }
        return mountList(
          'clipboard-list',
          sorted.map(clip => {
            const isPinned = pinned.includes(clip);
            return html`
              <div class="clipboard-item-row">
                <div class="clipboard-item" @click=${() => options.onSelectClip(clip)}>
                  ${isPinned ? '📌 ' : ''}${clip}
                </div>
                <button
                  class="clip-analyze-btn"
                  @click=${() => togglePin(clip)}
                  title=${isPinned ? 'Unpin' : 'Pin'}>
                  ${isPinned ? '📌' : '📍'}
                </button>
                <button class="clip-analyze-btn" @click=${() => options.onAnalyzeClip(clip)}>
                  ⚡
                </button>
                ${options.onDeleteClip
                  ? mountTemplate(html`
                      <button
                        class="clip-analyze-btn"
                        @click=${() => options.onDeleteClip!(clip)}
                        title="Delete">
                        ✕
                      </button>
                    `)
                  : ''}
              </div>
            `;
          })
        );
      }}
    </div>
  `);
}
