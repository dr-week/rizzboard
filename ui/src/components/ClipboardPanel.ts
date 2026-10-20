import { html } from '@zuari/dom';

export function ClipboardPanel(options: {
  history: { value: string[] };
  onSelectClip: (clip: string) => void;
  onClose: () => void;
}) {
  return html`
    <div class="clipboard-view">
      <div class="clipboard-header">
        <span>Recent Copied Snippets</span>
        <button class="back-link" @click=${options.onClose}>Close ✕</button>
      </div>
      <div class="clipboard-list">
        ${() => options.history.value.map(clip => html`
          <div class="clipboard-item" @click=${() => options.onSelectClip(clip)}>
            ${clip}
          </div>
        `)}
      </div>
    </div>
  `;
}
