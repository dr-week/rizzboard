import { html } from '@zuari/dom';
import { mountList, mountTemplate } from '../../services/dom-helper.ts';

export function ClipboardPanel(options: {
  history: { value: string[] };
  onSelectClip: (clip: string) => void;
  onAnalyzeClip: (clip: string) => void;
  onClose: () => void;
}) {
  return mountTemplate(html`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Copied Bubbles — Tap to Paste or ⚡ Reply</span>
        <button class="back-link" @click=${options.onClose}>Close ✕</button>
      </div>
      ${() => mountList(
        'clipboard-list',
        options.history.value.map(clip => html`
          <div class="clipboard-item-row">
            <div class="clipboard-item" @click=${() => options.onSelectClip(clip)}>
              ${clip}
            </div>
            <button class="clip-analyze-btn" @click=${() => options.onAnalyzeClip(clip)}>
              ⚡ Reply
            </button>
          </div>
        `)
      )}
    </div>
  `);
}
